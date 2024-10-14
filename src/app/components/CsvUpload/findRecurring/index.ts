import getDateScore from './getDateScore';
import getDescriptionScore from './getDescriptionScore';

export type FormattedDataProps = {
	amount: number;
	date: string;
	description: string;
	timestamp: number;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	timestampDayjs: any;
};

export default function findRecurring(data: FormattedDataProps[]) {
	const map = new Map<string, FormattedDataProps[]>();

	data.forEach((row) => {
		if (row?.description) {
			const rowArr = row.description.split(' ');
			const { timestampDayjs: rowTimestamp } = row;

			if (map.size === 0) {
				map.set(row.description, [row]);
			} else {
				let matchesFound = false;

				map.forEach((value, key) => {
					const keyArr = key.split(' ');
					const dateScore = getDateScore(value, rowTimestamp);
					const descriptionScore = getDescriptionScore(keyArr, rowArr);

					if (descriptionScore.md) {
						value.push(row);
						map.set(key, value);
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
