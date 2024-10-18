import type React from 'react';
import { TransactionsTable } from './TransactionsTable';
import type { GroupData } from '../../types';
import DisplayGroupName from './DisplayGroupName';

interface GroupProps {
	groupData: GroupData;
	setCSVData: React.Dispatch<React.SetStateAction<GroupData[]>>;
}

export default function Group({ groupData, setCSVData }: GroupProps) {
	return (
		<div className="px-4">
			<DisplayGroupName groupData={groupData} setCSVData={setCSVData} />

			<h4 className="mb-0 mt-2">
				<span>{groupData.description}</span>

				<span className="badge badge-secondary ml-2">
					{groupData.transactions.length + 1}
				</span>

				{groupData.possiblyRecurring && !groupData.recurring && (
					<span className="badge badge-accent ml-2">
						Possibly Recurring {groupData.possiblyRecurring}
					</span>
				)}

				{groupData.recurring && (
					<span className="badge badge-accent ml-2">
						Recurring {groupData.recurring}
					</span>
				)}
			</h4>

			<div>({groupData.prime.terms.join(', ')})</div>

			<TransactionsTable groupData={groupData} />

			<div className="divider" />
		</div>
	);
}
