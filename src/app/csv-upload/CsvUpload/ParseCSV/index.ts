import type { GroupsData, TransactionData } from '@/app/types';
import fauxPapaParseAsync from './papaParseAsync';
import findGroupsAndSingletons from './findGroupsAndSingletons';
import formatParsedData from './formatParsedData';
import findRecurringTransactions from './findRecurringTransactions';
import type { ParseCSVArgs, ParseCSVData } from './types';

export default class ParseCSV {
	private accountUid;
	private fileData;
	private formattedData: null | TransactionData[];
	private groups: null | GroupsData[];
	private parsedData: null | string[][];
	private singletons: null | TransactionData[];
	private userData;

	constructor({ fileData, userData, accountUid }: ParseCSVArgs) {
		this.accountUid = accountUid;
		this.fileData = fileData;
		this.formattedData = null;
		this.groups = null;
		this.parsedData = null;
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

		if (addRecurringData && this.formattedData) {
			return {
				groups: this.groups,
				singletons: this.singletons,
				total: this.formattedData.length,
			};
		}

		return false;
	}
}
