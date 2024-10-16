import dayjs from 'dayjs';
import type { FindGroupsProps } from '../types';
import fauxAsync from './fauxAsync';
import findGroups from './findGroups';
import getDateScore from './getDateScore';

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
		const formattedData = parsedData.map((d: string[], i: number) => {
			const filteredRow = d.filter((f) => f && f.length > 1);
			const amount = +(filteredRow?.at(1) ?? 0);
			const date = filteredRow?.at(0) ?? '';
			const description = filteredRow?.at(2)?.toLowerCase() ?? '';
			const id = `entry-${i}`;
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
				id,
				terms,
				timestamp,
			};
		});

		const groups: FindGroupsProps[] = findGroups(formattedData);
		const groupsRecurring: FindGroupsProps[] = groups.map((group) => ({
			...group,
			...getDateScore(group),
		}));

		return groupsRecurring;
	} catch (err) {
		console.error(err);
		return [];
	}
}
