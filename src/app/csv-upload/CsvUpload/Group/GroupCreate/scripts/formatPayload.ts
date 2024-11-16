import {
	createGroupData,
	createTransactionData,
	type GroupData,
	type TransactionData,
} from '@/app/types';
import { isoDate as isoDateFn } from '@/utils/supabase';

interface FormatPayloadArgs {
	formData: GroupData;
	group: GroupData;
	transactions: TransactionData[];
}

export default function formatPayload({
	formData,
	group,
	transactions,
}: FormatPayloadArgs) {
	const isoDate = isoDateFn();
	const updatedTransactions: TransactionData[] = transactions.map(
		(transaction) =>
			createTransactionData({
				...transaction,
				category: formData.category,
				created: isoDate,
				terms: Array.isArray(transaction.terms)
					? transaction.terms
					: transaction.terms.split(', '),
				updated: isoDate,
			}),
	);
	const updatedGroup: GroupData = createGroupData({
		...group,
		...formData,
		created: isoDate,
		prime: updatedTransactions[0].uid,
		terms: Array.isArray(formData.terms)
			? formData.terms
			: formData.terms.split(',').map((term) => term.trim()),
		updated: isoDate,
	});

	return { updatedGroup, updatedTransactions };
}
