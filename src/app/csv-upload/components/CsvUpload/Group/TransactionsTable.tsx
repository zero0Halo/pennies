import type { FormattedRowData } from '@/app/types';

interface TransactionsTableProps {
	transactions: FormattedRowData[];
}

const displayAmount = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
});

export function TransactionsTable({ transactions }: TransactionsTableProps) {
	return (
		<div className="overflow-x-auto">
			<table className="table table-zebra">
				<thead>
					<tr className="bg-neutral">
						<th />
						<th className="text-white text-base">Description</th>
						<th className="text-white text-base">Amount</th>
						<th className="text-white text-base">Date</th>
					</tr>
				</thead>

				<tbody>
					{transactions.length > 0 &&
						transactions.map((transaction, i) => (
							<tr className={i === 0 ? 'bg-primary' : ''} key={transaction.uid}>
								<th>{i + 1}</th>
								<td>{transaction.description}</td>
								<td>{displayAmount.format(transaction.amount)}</td>
								<td>{transaction.date}</td>
							</tr>
						))}
				</tbody>
			</table>
		</div>
	);
}
