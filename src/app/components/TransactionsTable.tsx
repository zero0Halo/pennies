import type { GroupData } from '../types';

interface TransactionsTableProps {
	data: GroupData;
}

export function TransactionsTable({ data }: TransactionsTableProps) {
	return (
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
	);
}
