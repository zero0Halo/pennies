import type { GroupData, TransactionData } from '@/app/types';
import type React from 'react';
import Button from '../Button';

interface GroupEditProps {
	group: GroupData | null;
	setActiveElement: () => void;
	transactions: TransactionData[] | null;
}

export default function GroupEdit({
	group,
	setActiveElement,
	transactions,
}: GroupEditProps): React.ReactNode {
	if (group === null || transactions === null) return null;

	return (
		<div className="bg-primary pt-1 p-8 rounded-lg relative">
			<h2>Edit Group: {group.name}</h2>
			<Button className="btn-warning" onClick={setActiveElement}>
				Cancel
			</Button>
		</div>
	);
}
