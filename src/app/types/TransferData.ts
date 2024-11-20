import { getIsoDate } from '@/utils/general';
import { v4 } from 'uuid';
import { z } from 'zod';
import type { TransactionData } from './TransactionData';
import { TRANSFER } from '../constants';
import type { GroupData } from './GroupData';

export const TransferDataSchema = z
	.object({
		amount: z.number(),
		created: z.string(),
		description: z.string(),
		from_account_uid: z.string(),
		to_account_uid: z.string(),
		uid: z.string(),
		updated: z.string(),
		user_uid: z.string(),
	})
	.strict();

export type TransferData = z.infer<typeof TransferDataSchema>;

export const createTransferData = (
	overrides: Partial<TransferData> = {},
): TransferData => {
	const isoDate = getIsoDate();
	const defaultValues = {
		amount: 0,
		created: isoDate,
		description: '',
		from_account_uid: '',
		to_account_uid: '',
		uid: v4(),
		updated: isoDate,
		user_uid: '',
	};

	return TransferDataSchema.parse({ ...defaultValues, ...overrides });
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const validateTransferData = (data: any) =>
	TransferDataSchema.parse(data);

interface CreateTransferPayloadArgs {
	group?: GroupData | undefined;
	transactions: TransactionData[];
}

interface CreateTransferPayloadData {
	group?: GroupData | null;
	transfers?: TransferData[] | null;
	transactions?: TransactionData[] | null;
}

export function createTransferPayload({
	group,
	transactions,
}: CreateTransferPayloadArgs): CreateTransferPayloadData | null {
	const returnData: CreateTransferPayloadData = {
		group: null,
		transfers: null,
		transactions: null,
	};
	const transfers = transactions.filter(
		(
			transaction,
		): transaction is TransactionData & { to_account_uid: string } =>
			transaction.category === TRANSFER &&
			transaction.to_account_uid !== undefined &&
			transaction.to_account_uid.length > 1,
	);

	if (transfers.length === 0) return returnData;

	const { user_uid } = transfers[0];
	const transferPayload: TransferData[] = transfers.map((transaction) => {
		const transfer = createTransferData();
		return {
			...transfer,
			amount: transaction.amount * -1,
			description: transaction.description,
			from_account_uid: transaction.account_uid,
			timestamp: transaction.timestamp,
			to_account_uid: transaction.to_account_uid,
			user_uid,
		};
	});

	if (transferPayload.length) {
		const transactionsPayload = transfers.map((transfer) => ({
			...transfer,
			transfer_uid: transferPayload[0].uid,
		}));
		returnData.transfers = transferPayload;
		returnData.transactions = transactionsPayload;
	}

	if (group)
		returnData.group = { ...group, transfer_uid: transferPayload[0].uid };

	return returnData;
}
