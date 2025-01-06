import {
	createGroupData,
	createTransactionData,
	createTransferPayload,
	type CreateTransferPayloadData,
	type GroupData,
	type TransactionData,
} from '@/app/types';
import { getIsoDate } from '@/utils/general';

interface FormatPayloadArgs {
	formData: GroupData;
	group: GroupData;
	transactions: TransactionData[];
}

export default function formatPayload({
	formData,
	group,
	transactions,
}: FormatPayloadArgs): CreateTransferPayloadData {
	const isoDate = getIsoDate();
	const updatedTransactions: TransactionData[] = transactions.map(
		(transaction) =>
			createTransactionData({
				...transaction,
				category: formData.category,
				created: isoDate,
				terms: transaction.terms,
				to_account_uid: formData.to_account_uid,
				updated: isoDate,
			}),
	);
	const updatedGroup: GroupData = createGroupData({
		...group,
		...formData,
		created: isoDate,
		prime: updatedTransactions[0].uid,
		terms: formData.terms,
		updated: isoDate,
	});
	const payload: CreateTransferPayloadData = createTransferPayload({
		group: updatedGroup,
		transactions: updatedTransactions,
	});

	return payload;
}
