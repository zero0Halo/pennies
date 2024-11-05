import type { GroupData, TransactionData } from '@/app/types';

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
	const date = new Date();
	const isoDate = date.toISOString();
	const updatedTransactions: TransactionData[] = transactions.map(
		(transaction) => ({
			...transaction,
			category: formData.category,
			created: isoDate,
			terms: Array.isArray(transaction.terms)
				? transaction.terms
				: transaction.terms.split(', '),
			updated: isoDate,
		}),
	);
	const updatedGroup: GroupData = {
		...group,
		...formData,
		created: isoDate,
		prime: updatedTransactions[0].uid,
		terms: Array.isArray(formData.terms)
			? formData.terms
			: formData.terms.split(',').map((term) => term.trim()),
		updated: isoDate,
	};

	return { updatedGroup, updatedTransactions };
}
