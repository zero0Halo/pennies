import type { GroupsData, TransactionData } from '@/app/types';
import fauxPapaParseAsync from './papaParseAsync';
import findGroupsAndSingletons from './findGroupsAndSingletons';
import formatParsedData from './formatParsedData';
import findRecurringTransactions from './findRecurringTransactions';
import hashCheck from './hashCheck';
import type { ParseCSVArgs, ParseCSVData } from './types';
import storage from '@/utils/app/storage';
import { CSV_UPLOAD } from '@/app/constants';

export default class ParseCSV {
	private accountUid;
	private fileData;
	private formattedData: null | TransactionData[];
	private groups: null | GroupsData[];
	private parsedData: null | string[][];
	private returnData: null | ParseCSVData;
	private singletons: null | TransactionData[];
	private userData;

	constructor({ fileData, userData, accountUid }: ParseCSVArgs) {
		this.accountUid = accountUid;
		this.fileData = fileData;
		this.formattedData = null;
		this.groups = null;
		this.parsedData = null;
		this.returnData = null;
		this.singletons = null;
		this.userData = userData;
	}

	async papaParseAsync(): Promise<boolean> {
		const { accountUid, fileData, userData } = this;
		if (accountUid === undefined || userData === null) return false;

		const parsedData = await fauxPapaParseAsync(fileData);
		this.parsedData = parsedData.map((dataRow) =>
			dataRow.filter((f) => f && f.length > 1),
		);

		return true;
	}

	formatParsedData(): boolean {
		const { accountUid, parsedData, userData } = this;
		if (accountUid === undefined || parsedData === null || userData === null)
			return false;

		this.formattedData = formatParsedData({
			accountUid,
			parsedData,
			user_uid: userData.uid,
		});

		return true;
	}

	findGroupsAndSingletons(): boolean {
		const { formattedData } = this;
		if (formattedData === null) return false;

		const { groups, singletons } = findGroupsAndSingletons(formattedData);
		this.groups = groups;
		this.singletons = singletons;

		return true;
	}

	addRecurringData(): boolean {
		const { groups } = this;
		if (groups === null) return false;

		this.groups = groups.map(({ group, transactions }) => {
			const recurringData = findRecurringTransactions(transactions);

			return !recurringData
				? { group, transactions }
				: {
						transactions,
						group: { ...group, ...recurringData },
					};
		});

		return true;
	}

	buildReturnData(): boolean {
		const { formattedData, groups, singletons } = this;
		if (!formattedData || !groups || !singletons) return false;

		this.returnData = {
			groups,
			singletons,
			total: formattedData.length,
		};

		return true;
	}

	async hashCheck(): Promise<boolean> {
		if (!this.returnData) return false;

		const result = await hashCheck(this.returnData);

		if (!result) return false;

		this.returnData = result;
		return true;
	}

	async go(): Promise<ParseCSVData | false> {
		const parseResults = await this.papaParseAsync();
		const formatParsedDataResults = !parseResults
			? false
			: this.formatParsedData();
		const findGroupsAndSingletonsResults = !formatParsedDataResults
			? false
			: this.findGroupsAndSingletons();
		const addRecurringData = !findGroupsAndSingletonsResults
			? false
			: this.addRecurringData();
		const buildReturnDataResults = !addRecurringData
			? false
			: this.buildReturnData();
		const hashCheckResults = !buildReturnDataResults
			? false
			: await this.hashCheck();

		if (hashCheckResults && this.returnData) {
			storage.set({ keyName: CSV_UPLOAD, data: this.returnData });
			return this.returnData;
		}

		return false;
	}
}
