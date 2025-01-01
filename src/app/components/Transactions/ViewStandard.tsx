import type React from 'react';
import Image from 'next/image';
import type { TransactionWithGroupData } from '@/app/types';
import { formatAmount, formatRecurring, zebra } from '@/utils/app';
import { tableClasses, tdOverflow, thClasses } from './helpers';

type ViewStandardProps = {
	activeElement: number | boolean;
	setActiveElement: (arg: number | boolean) => void;
	tableClassName: string;
	transactions: TransactionWithGroupData[];
};

export default function ViewStandard({
	tableClassName = '',
	transactions,
}: ViewStandardProps): React.ReactNode {
	return (
		<table className={tableClasses(tableClassName)}>
			<thead>
				<tr className="bg-neutral">
					<th className={thClasses(3)}>Name</th>
					<th className={thClasses(6)}>Description</th>
					<th className={thClasses(1)}>Amount</th>
					<th className={thClasses(1)}>Category</th>
					<th className={thClasses(1)}>Recurring</th>
				</tr>
			</thead>

			<tbody>
				{transactions.map((transaction, index) => (
					<tr className={zebra(index, transaction)} key={transaction.uid}>
						<td>
							<div className="flex">
								<span>{transaction.group_name ?? transaction.name}</span>
								{transaction.prime && (
									<span className="tooltip cursor-help" data-tip="Prime">
										<Image
											alt="A King's Crown"
											className="my-0 ml-2"
											height="16"
											src="/images/prime.svg"
											width="16"
										/>
									</span>
								)}
							</div>
						</td>
						<td className={tdOverflow()}>{transaction.description}</td>
						<td>{formatAmount(transaction.amount)}</td>
						<td>{transaction.category}</td>
						<td>{formatRecurring(transaction)}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
