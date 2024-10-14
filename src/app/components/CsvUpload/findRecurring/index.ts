import type { Dayjs } from 'dayjs';
import getDateScore from './getDateScore';
import getDescriptionScore from './getDescriptionScore';

export type FormattedDataProps = {
	amount: number;
	date: string;
	description: string;
	timestamp: Dayjs;
};

export default function findRecurring(data: FormattedDataProps[]) {
	const map = new Map<string, FormattedDataProps[]>();

	data.forEach((row) => {
		if (row?.description) {
			const rowArr = row.description.split(' ');
			const { timestamp } = row;

			if (map.size === 0) {
				map.set(row.description, [row]);
			} else {
				let matchesFound = false;

				map.forEach((mapValue, key) => {
					const keyArr = key.split(' ');
					const dateScore = getDateScore(mapValue, timestamp);
					const descriptionScore = getDescriptionScore(keyArr, rowArr);

					if (descriptionScore.md) {
						mapValue.push(row);
						map.set(key, mapValue);
						matchesFound = true;
					}
				});

				if (!matchesFound) {
					map.set(row.description, [row]);
				}
			}
		}
	});

	return map;
}
