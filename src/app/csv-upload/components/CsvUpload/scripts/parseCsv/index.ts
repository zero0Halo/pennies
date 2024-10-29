import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import type { GroupData } from '@/app/types';
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
				uid,
				terms,
				timestamp,
			};
		});

		let groups: GroupData[] = findGroups(formattedData);
		groups = groups.slice().map((group) => ({
			...group,
			...findRecurring(group),
		}));

		const total = formattedData.length;
		const numGroups = groups.length;
		const recurringGroups = groups.filter((f) => f.transactions.length);
		const singletons = groups.filter((f) => !f.transactions.length);
		const numGroupTransactions = recurringGroups.reduce(
			(acc, current) => acc + current.transactions.length + 1,
			0,
		);

		console.log({
			total,
			numGroups,
			recurringGroups,
			singletons,
			numGroupTransactions,
		});

		return groups;
	} catch (err) {
		console.error(err);
		return [];
	}
}
