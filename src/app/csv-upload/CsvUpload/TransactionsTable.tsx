import type { TransactionData } from '@/app/types';
import dateFormat from '@/app/utils/dateFormat';

interface TransactionsTableProps {
	className?: string;
	tableClassName?: string;
	transactions: TransactionData[];
}

const displayAmount = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
});

function zebra(index: number, transaction: TransactionData) {
	const zebraColor = index % 2 ? 'bg-slate-100' : 'bg-white';
	return transaction.prime ? 'bg-primary' : zebraColor;
}

export function TransactionsTable({
	className = '',
	tableClassName = '',
	transactions,
}: TransactionsTableProps) {
	const classes = ['overflow-hidden', className].join(' ');
	const tableClasses = [
		'table overflow-hidden rounded-lg',
		tableClassName,
	].join(' ');

	return (
		<div className={classes}>
			<table className={tableClasses}>
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
