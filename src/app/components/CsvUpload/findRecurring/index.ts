import getDescriptionScore from './getDescriptionScore';

type FormattedDataProps = {
	amount: number;
	date: string;
	description: string;
	timestamp: number;
};

export default function findRecurring(data: FormattedDataProps[]) {
	const map = new Map<string, FormattedDataProps[]>();

	data.forEach((row) => {
		if (row?.description) {
			const rowArr = row.description.split(' ');

			if (map.size === 0) {
				map.set(row.description, [row]);
			} else {
				let matchesFound = false;

				map.forEach((value, key) => {
					const keyArr = key.split(' ');
					const descriptionConfidence = getDescriptionScore(keyArr, rowArr);

					if (descriptionConfidence.md) {
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
