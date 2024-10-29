import type React from 'react';
import { TransactionsTable } from './TransactionsTable';
import type { FindGroupsData, GroupData, GroupsData } from '../../../../types';
import DisplayGroupName from './DisplayGroupName';

interface GroupProps {
	groupData: GroupsData;
	setCSVData: React.Dispatch<React.SetStateAction<FindGroupsData | undefined>>;
}

export default function Group({
	groupData: { group, transactions },
	setCSVData,
}: GroupProps) {
	return (
		<div className="px-4">
			<DisplayGroupName group={group} setCSVData={setCSVData} />

			<h4 className="mb-0 mt-2 flex align-center">
				<span>{group.description}</span>

				<div className="badge badge-secondary ml-2 h-6 text-xs">
					{group.count}
				</div>

				{group.recurring && (
					<>
						<div className="badge badge-accent badge-sm ml-2 h-6">
							Recurring
						</div>
						<div className="badge badge-accent badge-sm ml-2 h-6">
							{group.recurring}
						</div>
						{group.stillRecurring && (
							<div className="badge badge-accent badge-sm ml-2 h-6">
								Still Recurring
							</div>
						)}
					</>
				)}
			</h4>

			<div>({group.terms.join(', ')})</div>

			<TransactionsTable transactions={transactions} />

			<div className="divider" />
		</div>
	);
}
