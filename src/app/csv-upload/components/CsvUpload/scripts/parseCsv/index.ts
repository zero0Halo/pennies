import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie';
import type { FindGroupsData } from '@/app/types';
import fauxAsync from './fauxAsync';
import findGroups from './findGroups';
import findRecurring from './findRecurring';

function isCookieSizeWithinLimit(name: string, value: string) {
	// Calculate size of the cookie name, value, and necessary separators (e.g., '=' and ';')
	const cookieSize = new Blob([`${name}=${value};`]).size;
	const maxCookieSize = 4096; // 4 KB limit
	console.log(cookieSize);
	return cookieSize <= maxCookieSize;
}

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
			const timestamp = new Date(date).toISOString();

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

		localStorage.setItem('csv-upload', JSON.stringify(returnData));

		return returnData;
	} catch (err) {
		console.error(err);
		return { groups: [], singletons: [], total: 0 };
	}
}
