import type { TransactionWithGroupData } from '@/app/types';

export default function formatRecurring(
	transaction: TransactionWithGroupData,
): string {
	const { group_recurring, group_still_recurring } = transaction;

	if (typeof group_recurring === 'string' && group_recurring !== 'false') {
		if (group_still_recurring) return group_recurring;
		return 'Ended';
	}

	return '';
}
