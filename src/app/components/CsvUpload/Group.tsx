import type React from 'react';
import { TransactionsTable } from './TransactionsTable';
import type { GroupData } from '../../types';
import DisplayGroupName from './DisplayGroupName';
import RecurringStatus from './RecurringStatus';

interface GroupProps {
	groupData: GroupData;
	setCSVData: React.Dispatch<React.SetStateAction<GroupData[]>>;
}

export default function Group({ groupData, setCSVData }: GroupProps) {
	return (
		<div className="px-4">
			<DisplayGroupName groupData={groupData} setCSVData={setCSVData} />

			<h4 className="mb-0 mt-2 flex align-center">
				<span>{groupData.description}</span>

				<div className="badge badge-secondary ml-2 h-6 text-xs">
					{groupData.transactions.length + 1}
				</div>

				<RecurringStatus groupData={groupData} setCSVData={setCSVData} />
			</h4>

			<div>({groupData.prime.terms.join(', ')})</div>

			<TransactionsTable groupData={groupData} />

			<div className="divider" />
		</div>
	);
}
