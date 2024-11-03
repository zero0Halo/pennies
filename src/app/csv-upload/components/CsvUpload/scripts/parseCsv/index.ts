import { v4 as uuidv4 } from 'uuid';
import type { FindGroupsData } from '@/app/types';
import { CSV_UPLOAD } from '@/app/constants';
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

export default async function parseCsv(
	fileData: File,
): Promise<FindGroupsData> {
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
			let timestamp = '';
			try {
				timestamp =
					date.length > 0
						? new Date(date).toISOString()
						: new Date().toISOString();
			} catch (err) {
				console.log({ date, err });
			}

			return {
				amount,
				category: '',
				created: '',
				description,
				group_uid: '',
				prime: false,
				terms,
				timestamp,
				updated: '',
				uid,
			};
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

		return returnData;
	} catch (err) {
		console.error(err);
		return { groups: [], singletons: [], total: 0 };
	}
}
