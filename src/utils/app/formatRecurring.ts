import type { TransactionWithGroupData } from '@/app/types';

export default function formatRecurring(
	transaction: TransactionWithGroupData,
): string {
	const { group_recurring, group_recurring_type, group_still_recurring } =
		transaction;

	if (group_recurring && group_recurring_type !== undefined) {
		if (group_still_recurring) return group_recurring_type;
		return 'Ended';
	}

	return '';
}
