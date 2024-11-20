import { v4 as uuidv4 } from 'uuid';
import {
	createTransactionData,
	type TransactionData,
	type FindGroupsData,
	type UserData,
} from '@/app/types';
import { CSV_UPLOAD } from '@/app/constants';
import fauxAsync from './fauxAsync';
import findGroups from './findGroups';
import findRecurring from './findRecurring';
import { getIsoDate } from '@/utils/general';

const regex = {
	creditCard: /card \d+/g,
	date: /\d{2}\/\d{2}/g,
	numericIds: /\b[0-9]{5,}\b/g,
	mixedIds: /\b(?=\w*[a-zA-Z])(?=\w*\d)\w+\b/g,
};

const blacklist = [
	'austin',
	'authorized',
	'inst',
	'for',
	'money',
	'on',
	'payment',
	'paypal',
	'pflugerville',
	'pp',
	'purchase',
	'steve',
	'steven',
	'swanson',
	'transfer',
	'tx',
	'xfer',
];

export default async function parseCsv(
	fileData: File,
	userData: UserData | null,
	account_uid: string | undefined,
): Promise<FindGroupsData | boolean> {
	try {
		const user_uid = userData?.uid ?? false;

		if (user_uid === false || !account_uid)
			return new Promise((_, reject) => reject(false));

		const parsedData = await fauxAsync(fileData);
		const formattedData: TransactionData[] = parsedData.map((d: string[]) => {
			const filteredRow = d.filter((f) => f && f.length > 1);
			const amount = +(filteredRow?.at(1) ?? 0);
			const date = filteredRow?.at(0) ?? '';
			const description = filteredRow?.at(2)?.toLowerCase() ?? '';
			const terms = description
				.replace(regex.creditCard, '')
				.replace(regex.date, '')
				.replace(regex.numericIds, '')
				.replace(regex.mixedIds, '')
				.split(' ')
				.filter((term) => !blacklist.includes(term) && term.length > 0);
			const timestamp = getIsoDate(date);
			const uid = uuidv4();

			const transactionData: TransactionData = createTransactionData({
				account_uid,
				amount,
				category: '',
				created: '',
				description,
				group_uid: '',
				prime: false,
				terms,
				timestamp,
				to_account_uid: undefined,
				transfer_uid: undefined,
				updated: '',
				uid,
				user_uid,
			});

			return transactionData;
		});

		const { groups, singletons }: FindGroupsData = findGroups(formattedData);
		const updatedGroups = groups.map(({ group, transactions }) => ({
			transactions,
			group: { ...group, ...findRecurring(transactions) },
		}));

		const returnData = {
			groups: updatedGroups,
			singletons,
			total: formattedData.length,
		};

		localStorage.setItem(CSV_UPLOAD, JSON.stringify(returnData));

		return new Promise((resolve) => resolve(returnData));
	} catch (err) {
		console.error(err);
		return { groups: [], singletons: [], total: 0 };
	}
}
