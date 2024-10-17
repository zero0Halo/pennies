import type React from 'react';
import { useState } from 'react';
import { EditGroupName } from './EditGroupName';
import { TransactionsTable } from './TransactionsTable';
import type { GroupData } from '../types';

interface GroupProps {
	groupData: GroupData;
	setCSVData: React.Dispatch<React.SetStateAction<GroupData[]>>;
}

export default function Group({ groupData, setCSVData }: GroupProps) {
	const [editing, setEditing] = useState(false);

	return (
		<div className="px-4">
			{groupData.name && <h3 className="mb-0">{groupData.name}</h3>}

			{editing && (
				<EditGroupName
					groupData={groupData}
					setCSVData={setCSVData}
					setEditing={setEditing}
				/>
			)}

			<h4 className="mb-0">
				{!groupData.name && (
					<div
						className="tooltip tooltip-right tooltip-warning"
						data-tip="Click here to add a name for this group!"
					>
						<button
							className="btn btn-warning btn-xs btn-circle mr-2"
							onClick={() => setEditing(true)}
							type="button"
						>
							<span className="font-bold">!!!</span>
						</button>
					</div>
				)}

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
