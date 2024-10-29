import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import type { FindGroupData, GroupData } from '@/app/types';
import fauxAsync from './fauxAsync';
import findGroups from './findGroups';
import findRecurring from './findRecurring';

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

export default async function parseCsv(fileData: File) {
	try {
		const parsedData = await fauxAsync(fileData);
		const formattedData = parsedData.map((d: string[]) => {
			const filteredRow = d.filter((f) => f && f.length > 1);
			const amount = +(filteredRow?.at(1) ?? 0);
			const date = filteredRow?.at(0) ?? '';
			const description = filteredRow?.at(2)?.toLowerCase() ?? '';
			const uid = uuidv4();
			const terms = description
				.replace(regex.creditCard, '')
				.replace(regex.date, '')
				.replace(regex.numericIds, '')
				.replace(regex.mixedIds, '')
				.split(' ')
				.filter((term) => !blacklist.includes(term) && term.length > 0);
			const timestamp = dayjs(new Date(date).getTime());

			return {
				amount,
				date,
				description,
				group_uid: '',
				prime: false,
				uid,
				terms,
				timestamp,
			};
		});

		const { groups, singletons }: FindGroupData = findGroups(formattedData);
		const updatedGroups = groups.map(({ group, transactions }) => ({
			transactions,
			group: { ...group, ...findRecurring(transactions) },
		}));

		const expectedTotal = formattedData.length;
		const numGroups = updatedGroups.length;
		const recurringGroups = updatedGroups.filter(
			({ group }) => group.recurring,
		);
		const numSingletons = singletons.length;
		const numGroupTransactions = updatedGroups.reduce(
			(acc, current) => acc + current.transactions.length,
			0,
		);

		console.log({
			actualTotal: numSingletons + numGroupTransactions,
			expectedTotal,
			numGroups,
			recurringGroups,
			numSingletons,
			numGroupTransactions,
		});

		return [];
	} catch (err) {
		console.error(err);
		return [];
	}
}
