import type React from 'react';
import type { TransactionWithGroupData } from '@/app/types';
import classNames from 'classnames';
import { formatAmount, formatDate, formatRecurring, zebra } from '@/utils/app';

type ViewSingletonCompleteProps = {
	tableClassName: string;
	transactions: TransactionWithGroupData[];
};

export default function ViewSingletonComplete({
	tableClassName,
	transactions,
}: ViewSingletonCompleteProps): React.ReactNode {
	// SHUGAH
	const tableClasses = classNames(
		'table table-fixed overflow-hidden rounded-lg  mt-0',
		tableClassName,
	);
	const thClass = (i: number) => `text-white text-sm py-1 w-${i}/12`;

	return (
		<table className={tableClasses}>
			<thead>
				<tr className="bg-neutral">
					<th className="w-[20px]" />
					<th className={thClass(2)}>Name</th>
					<th className={thClass(5)}>Description</th>
					<th className={thClass(1)}>Amount</th>
					<th className={thClass(2)}>Date</th>
					<th className={thClass(1)}>Category</th>
					<th className={thClass(1)}>Recurring</th>
				</tr>
			</thead>

			<tbody>
				{transactions.map((transaction, index) => (
					<tr className={zebra(index, transaction)} key={transaction.uid}>
						<td>{index + 1}</td>
						<td>{transaction.name}</td>
						<td className="overflow-x-hidden whitespace-nowrap text-ellipsis">
							{transaction.description}
						</td>
						<td>{formatAmount(transaction.amount)}</td>
						<td>{formatDate(transaction.timestamp)}</td>
						<td>{transaction.category}</td>
						<td>{formatRecurring(transaction)}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
