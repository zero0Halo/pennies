import type React from 'react';
import { TransactionsTable } from './TransactionsTable';
import type { GroupData } from '../../../../types';
import DisplayGroupName from './DisplayGroupName';

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

				{groupData.recurring && (
					<>
						<div className="badge badge-accent badge-sm ml-2 h-6">
							Recurring
						</div>
						<div className="badge badge-accent badge-sm ml-2 h-6">
							{groupData.recurring}
						</div>
						{groupData.stillRecurring && (
							<div className="badge badge-accent badge-sm ml-2 h-6">
								Still Recurring
							</div>
						)}
					</>
				)}
			</h4>

			<div>({groupData.prime.terms.join(', ')})</div>

			<TransactionsTable groupData={groupData} />

			<div className="divider" />
		</div>
	);
}
