import { useState } from 'react';

import type { GroupProps } from '../types';
import { GroupName } from './GroupName';

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

			<div className="overflow-x-auto">
				<table className="table table-zebra">
					<thead>
						<tr>
							<th />
							<th>Description</th>
							<th>Amount</th>
							<th>Date</th>
						</tr>
					</thead>

					<tbody>
						<tr className="bg-primary">
							<th>1</th>
							<td>{data.prime.description}</td>
							<td>{data.prime.amount}</td>
							<td>{data.prime.date}</td>
						</tr>

						{data.transactions.length > 1 &&
							data.transactions.map((transaction, i) => (
								<tr key={transaction.id}>
									<th>{i + 2}</th>
									<td>{transaction.description}</td>
									<td>{transaction.amount}</td>
									<td>{transaction.date}</td>
								</tr>
							))}
					</tbody>
				</table>
			</div>

			<div className="divider" />
		</div>
	);
}
