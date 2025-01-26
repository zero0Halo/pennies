import type { GroupData, TransactionData } from '@/app/types';
import type React from 'react';

interface GroupEditProps {
	group: GroupData | null;
	transactions: TransactionData[] | null;
}

export default function GroupEdit({
	group,
	transactions,
}: GroupEditProps): React.ReactNode {
	if (group === null || transactions === null) return null;

	return (
		<div className="bg-primary pt-1 p-8 rounded-lg relative">
			<h2>Edit Group: {group.name}</h2>
		</div>
	);
}
