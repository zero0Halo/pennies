import type React from 'react';
import type { TransactionData } from '@/app/types';
import { formatAmount, formatDate, zebra } from '@/utils/app';
import { tableClasses, tdOverflow, thClasses } from '../helpers';

type TransactionsGroupedProps = {
	tableClassName: string;
	transactions: TransactionData[];
};

export default function TransactionsGrouped({
	tableClassName,
	transactions,
}: TransactionsGroupedProps): React.ReactNode {
	return (
		<table className={tableClasses(tableClassName)}>
			<thead className="sticky top-0 z-50 mt-0">
				<tr className="bg-neutral">
					<th className="w-[20px]" />
					<th className={thClasses(8)}>Description</th>
					<th className={thClasses(2)}>Amount</th>
					<th className={thClasses(2)}>Date</th>
				</tr>
			</thead>

			<tbody>
				{transactions.map((transaction, index) => (
					<tr className={zebra(index, transaction)} key={transaction.uid}>
						<td>{index + 1}</td>
						<td className={tdOverflow()}>{transaction.description}</td>
						<td>{formatAmount(transaction.amount)}</td>
						<td>{formatDate(transaction.timestamp)}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
