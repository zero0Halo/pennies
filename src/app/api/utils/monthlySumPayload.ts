import type { MonthlySumData, TransactionData } from '@/app/types';
import { v4 as uuidv4 } from 'uuid';

export default function monthlySumPayload(
	transactions: TransactionData[],
	sumData: MonthlySumData[],
): MonthlySumData[] {
	const payloadMap = new Map<string, MonthlySumData[]>();

	// Format the transactions data into MonthlySumData
	const payloadArr: MonthlySumData[] = transactions.map(
		({ account_uid, amount, timestamp, user_uid }) => {
			const date = new Date(timestamp);
			const isoDate = new Date().toISOString();
			const month = date.getMonth() + 1;
			const year = date.getFullYear();
			const month_uid_key = `${month}-${year}-${user_uid}-${account_uid}`;

			return {
				account_uid,
				created: isoDate,
				month_uid_key,
				sum: amount,
				timestamp,
				uid: uuidv4(),
				updated: isoDate,
				user_uid,
			};
		},
	);

	// Group entries by month_uid_key
	payloadArr.forEach((entry) => {
		const keyExists = payloadMap.get(entry.month_uid_key);
		if (!keyExists) {
			payloadMap.set(entry.month_uid_key, [entry]);
		} else {
			payloadMap.set(entry.month_uid_key, [...keyExists, entry]);
		}
	});

	// Return a single entry per unique month_uid_key with their total sum
	const payload: MonthlySumData[] = Array.from(payloadMap.values()).map(
		(entries: MonthlySumData[]) => {
			const prime = { ...entries[0] };
			const currentSum =
				sumData.find((current) => current.month_uid_key === prime.month_uid_key)
					?.sum ?? 0;
			const sum =
				currentSum + entries.reduce((acc, current) => acc + current.sum, 0);
			return { ...prime, sum };
		},
	);

	return payload;
}
