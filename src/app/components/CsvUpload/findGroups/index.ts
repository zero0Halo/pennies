import getDescriptionScore from './getDescriptionScore';
import type { FindGroupsProps, FormattedDataProps } from '../index';

export default function findGroups(data: FormattedDataProps[]) {
	const map = new Map<string, FormattedDataProps[]>();

	data.forEach((row) => {
		if (map.size === 0) {
			map.set(row.description, [row]);
		} else {
			let matchesFound = false;

			map.forEach((mapValue: FormattedDataProps[], key: string) => {
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

	const asArray: FindGroupsProps[] = Array.from(map)
		.map(([description, transactions]: [string, FormattedDataProps[]]) => {
			if (!description && !transactions.length && !Array.isArray(transactions))
				return false;

			const prime = transactions.shift();

			if (!prime) return false;

			return {
				description,
				id: prime.id,
				prime,
				transactions,
			};
		})
		.filter((f) => f !== false);

	return asArray;
}
