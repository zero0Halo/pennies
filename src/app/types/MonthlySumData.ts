import { getIsoDate } from '@/utils/general';
import { z } from 'zod';
import type { TransferData } from './TransferData';
import type { TransactionData } from './TransactionData';
import { v4 } from 'uuid';

export const MonthlySumDataSchema = z
	.object({
		account_uid: z.string(),
		created: z.string(),
		month_uid_key: z.string(),
		sum: z.number(),
		timestamp: z.string(),
		uid: z.string(),
		updated: z.string(),
		user_uid: z.string(),
	})
	.strict();

export type MonthlySumData = z.infer<typeof MonthlySumDataSchema>;

export const createMonthlySumData = (
	overrides: Partial<MonthlySumData> = {},
): MonthlySumData => {
	const isoDate = getIsoDate();
	const defaultValues = {
		account_uid: '',
		created: isoDate,
		month_uid_key: '',
		uid: v4(),
		updated: isoDate,
		user_uid: '',
		sum: 0,
		timestamp: '',
	};

	return MonthlySumDataSchema.parse({ ...defaultValues, ...overrides });
};

// biome-ignore lint/suspicious/noExplicitAny: There's no way to know what's coming in, hence the validation
export const validateMonthlySumData = (data: any) => {
	const result = MonthlySumDataSchema.safeParse(data);

	return !!result?.success;
};

interface CreateMonthlySumPayloadArgs {
	snapshot?: MonthlySumData[] | undefined | null;
	transfers?: TransferData[] | null;
	transactions: TransactionData[];
}

export function createMonthlySumPayload({
	snapshot,
	transfers,
	transactions,
}: CreateMonthlySumPayloadArgs): MonthlySumData[] | null {
	if (snapshot === null || snapshot === undefined) return null;

	const payloadMap = new Map<string, MonthlySumData[]>();

	// Format the transactions data into MonthlySumData
	let payloadArr: MonthlySumData[] = transactions.map(
		({ account_uid, amount, timestamp, user_uid }) => {
			const date = new Date(timestamp);
			const month = date.getMonth() + 1;
			const year = date.getFullYear();
			const month_uid_key = `${month}-${year}-${user_uid}-${account_uid}`;

			return createMonthlySumData({
				account_uid,
				month_uid_key,
				sum: amount,
				timestamp,
				user_uid,
			});
		},
	);

	// If they exist, format the transfers data into MonthlySumData and concatenate it into payloadArr
	if (transfers && transfers !== null && transfers.length > 0) {
		const transfersToPayload = transfers.map(
			({ amount, user_uid, timestamp, to_account_uid: account_uid }) => {
				const date = new Date(timestamp);
				const month = date.getMonth() + 1;
				const year = date.getFullYear();
				const month_uid_key = `${month}-${year}-${user_uid}-${account_uid}`;

				return createMonthlySumData({
					account_uid,
					month_uid_key,
					sum: amount,
					timestamp,
					user_uid,
				});
			},
		);

		payloadArr = [...payloadArr, ...transfersToPayload];
	}

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
			const snapshotEntry = snapshot.find(
				(current) => current.month_uid_key === prime.month_uid_key,
			);
			const created = snapshotEntry ? snapshotEntry.created : prime.created;
			const currentSum = snapshotEntry ? snapshotEntry.sum : 0;
			const sum =
				currentSum + entries.reduce((acc, current) => acc + current.sum, 0);
			return { ...prime, created, sum };
		},
	);

	return payload;
}
