import getDescriptionScore from './getDescriptionScore';
import type { FormattedRowData, GroupData } from '@/app/types';

export default function findGroups(data: FormattedRowData[]) {
	const map = new Map<string, FormattedRowData[]>();

	data.forEach((row) => {
		if (map.size === 0) {
			map.set(row.description, [row]);
		} else {
			let matchesFound = false;

			map.forEach((mapValue: FormattedRowData[], key: string) => {
				const descriptionScore = getDescriptionScore(
					mapValue.at(0)?.terms ?? [],
					row.terms,
				);

				if (descriptionScore > 75) {
					mapValue.push(row);
					map.set(key, mapValue);
					matchesFound = true;
				}
			});

			if (!matchesFound) {
				map.set(row.description, [row]);
			}
		}
	});

	const asArray: GroupData[] = Array.from(map)
		.map(([description, transactions]: [string, FormattedRowData[]]) => {
			if (!description && !transactions.length && !Array.isArray(transactions))
				return false;

			const prime = transactions.shift();

			if (!prime) return false;

			return {
				count: 0,
				description,
				uid: prime.uid,
				name: false,
				prime,
				recurring: false,
				stillRecurring: false,
				transactions,
			};
		})
		.filter((f) => f !== false);

	return asArray;
}
