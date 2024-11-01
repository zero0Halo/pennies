import type { FormattedRowData } from '@/app/types';
import dateFormat from '@/app/utils/dateFormat';

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
		<div className="overflow-hidden">
			<table className="table rounded-lg overflow-hidden">
				<thead>
					<tr className="bg-neutral">
						<th />
						<th className="text-white text-base py-1">Description</th>
						<th className="text-white text-base py-1">Amount</th>
						<th className="text-white text-base py-1">Date</th>
					</tr>
				</thead>

				<tbody>
					{transactions.length > 0 &&
						transactions.map((transaction, index) => (
							<tr className={zebra(index, transaction)} key={transaction.uid}>
								<th>{index + 1}</th>
								<td>{transaction.description}</td>
								<td>{displayAmount.format(transaction.amount)}</td>
								<td>{dateFormat(transaction.timestamp)}</td>
							</tr>
						))}
				</tbody>
			</table>
		</div>
	);
}
