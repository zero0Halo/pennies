import type React from 'react';
import { TransactionsTable } from './TransactionsTable';
import type { GroupData } from '../../types';
import DisplayGroupName from './DisplayGroupName';

interface GroupProps {
	groupData: GroupData;
	setCSVData: React.Dispatch<React.SetStateAction<GroupData[]>>;
}

export default function Group({ groupData, setCSVData }: GroupProps) {
	const recurringStatus = groupData?.recurring
		? {
				label: 'Recurring',
				interval: groupData?.recurring,
			}
		: groupData?.possiblyRecurring
			? {
					label: 'Possibly Recurring',
					interval: groupData?.possiblyRecurring,
				}
			: false;

	const testing =
		groupData.prime.terms.includes('favor') &&
		groupData.prime.terms.includes('heb');

	if (testing) {
		console.log(groupData);
	}

	return (
		<div className="px-4">
			<DisplayGroupName groupData={groupData} setCSVData={setCSVData} />

			<h4 className="mb-0 mt-2 flex align-center">
				<span>{groupData.description}</span>

				<div className="badge badge-secondary ml-2 h-6 text-xs">
					{groupData.transactions.length + 1}
				</div>

				{recurringStatus && (
					<div className="badge badge-accent ml-2 h-6">
						{recurringStatus.label} {recurringStatus.interval}
					</div>
				)}
			</h4>

			<div>({groupData.prime.terms.join(', ')})</div>

			<TransactionsTable groupData={groupData} />

			<div className="divider" />
		</div>
	);
}
