import type { TransactionData } from '@/app/types';
import { v4 as uuidv4 } from 'uuid';

interface MonthlySumData {
	created: string;
	month_uid_key: string;
	timestamp: string;
	uid: string;
	updated: string;
	user_uid: string;
	sum: number;
}

export default function monthlySumPayload(
	transactions: TransactionData[],
): MonthlySumData[] {
	const payloadMap = new Map<string, MonthlySumData[]>();
	const payloadArr: MonthlySumData[] = transactions.map(
		({ amount, timestamp, user_uid }) => {
			const date = new Date(timestamp);
			const isoDate = new Date().toISOString();
			const month = date.getMonth();
			const year = date.getFullYear();
			const month_uid_key = `${month}-${year}-${user_uid}`;

			return {
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

	payloadArr.forEach((entry) => {
		const keyExists = payloadMap.get(entry.month_uid_key);
		if (!keyExists) {
			payloadMap.set(entry.month_uid_key, [entry]);
		} else {
			payloadMap.set(entry.month_uid_key, [...keyExists, entry]);
		}
	});

	const payload: MonthlySumData[] = Array.from(payloadMap.values()).map(
		(entries: MonthlySumData[]) => {
			const sum = entries.reduce((acc, current) => acc + current.sum, 0);
			return { ...entries[0], sum };
		},
	);

	return payload;
}
