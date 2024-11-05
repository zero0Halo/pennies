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
			updated: isoDate,
		}),
	);
	const updatedGroup: GroupData = {
		...group,
		...formData,
		created: isoDate,
		prime: updatedTransactions[0].uid,
		updated: isoDate,
	};

	return { updatedGroup, updatedTransactions };
}
