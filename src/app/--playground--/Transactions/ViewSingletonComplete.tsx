import type React from 'react';
import type { TransactionWithGroupData } from '@/app/types';
import { formatAmount, formatDate, zebra } from '@/utils/app';
import { tableClasses, tdOverflow, thClasses } from './helpers';

type ViewSingletonCompleteProps = {
	tableClassName: string;
	transactions: TransactionWithGroupData[];
};

export default function ViewSingletonComplete({
	tableClassName,
	transactions,
}: ViewSingletonCompleteProps): React.ReactNode {
	return (
		<table className={tableClasses(tableClassName)}>
			<thead>
				<tr className="bg-neutral">
					<th className="w-[20px]" />
					<th className={thClasses(2)}>Name</th>
					<th className={thClasses(6)}>Description</th>
					<th className={thClasses(1)}>Amount</th>
					<th className={thClasses(2)}>Date</th>
					<th className={thClasses(1)}>Category</th>
				</tr>
			</thead>

			<tbody>
				{transactions.map((transaction, index) => (
					<tr className={zebra(index, transaction)} key={transaction.uid}>
						<td>{index + 1}</td>
						<td>{transaction.name}</td>
						<td className={tdOverflow()}>{transaction.description}</td>
						<td>{formatAmount(transaction.amount)}</td>
						<td>{formatDate(transaction.timestamp)}</td>
						<td>{transaction.category}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
