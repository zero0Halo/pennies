import dayjs from 'dayjs';
import fauxAsync from './fauxAsync';
import findRecurring from './findRecurring';

export default async function parseCsv(fileData: File) {
	try {
		const parsedData = await fauxAsync(fileData);
		const formattedData = parsedData.map((d: string[]) => {
			const filteredRow = d.filter((f) => f.length > 1);
			const amount = +(filteredRow?.at(1) ?? 0);
			const date = filteredRow?.at(0) ?? '';
			const description = filteredRow?.at(2)?.toLowerCase() ?? '';
			const timestamp = new Date(date).getTime() / 1000;
			return {
				amount,
				date,
				description,
				timestamp: dayjs(timestamp),
			};
		});
		const recurring = findRecurring(formattedData);

		return recurring;
	} catch (err) {
		console.error(err);
		return false;
	}
}
