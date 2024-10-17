import type React from 'react';
import { useState } from 'react';
import { GroupName } from './GroupName';
import { TransactionsTable } from './TransactionsTable';
import type { GroupData } from '../types';

interface GroupProps {
	data: GroupData;
	setCSVData: React.Dispatch<React.SetStateAction<GroupData[]>>;
}

export default function Group({ data, setCSVData }: GroupProps) {
	const [editing, setEditing] = useState(false);

	return (
		<div className="px-4">
			{data.name && <h3 className="mb-0">{data.name}</h3>}
			{editing && (
				<GroupName
					data={data}
					setCSVData={setCSVData}
					setEditing={setEditing}
				/>
			)}

			<h4 className="mb-0">
				{!data.name && (
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

				<span>{data.description}</span>

				<span className="badge badge-secondary ml-2">
					{data.transactions.length + 1}
				</span>

				{data.possiblyRecurring && !data.recurring && (
					<span className="badge badge-accent ml-2">
						Possibly Recurring {data.possiblyRecurring}
					</span>
				)}

				{data.recurring && (
					<span className="badge badge-accent ml-2">
						Recurring {data.recurring}
					</span>
				)}
			</h4>

			<div>({data.prime.terms.join(', ')})</div>

			<TransactionsTable data={data} />

			<div className="divider" />
		</div>
	);
}
