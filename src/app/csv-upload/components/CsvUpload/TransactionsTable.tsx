import type { FormattedRowData } from '@/app/types';

interface TransactionsTableProps {
	transactions: FormattedRowData[];
}

const displayAmount = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
});

function zebra(index: number, transaction: FormattedRowData) {
	const zebraColor = index % 2 ? 'bg-slate-100' : 'bg-white';
	return transaction.prime ? 'bg-primary' : zebraColor;
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
	return (
		<div className="overflow-x-auto">
			<table className="table">
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
						transactions.map((transaction, index) => (
							<tr className={zebra(index, transaction)} key={transaction.uid}>
								<th>{index + 1}</th>
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
