import type React from 'react';
import Image from 'next/image';
import type { TransactionWithGroupData } from '@/app/types';
import { formatAmount, formatRecurring, zebra } from '@/utils/app';
import { tableClasses, tdClasses, tdOverflow, thClasses } from './helpers';
import classNames from 'classnames';

type ViewStandardProps = {
	activeElement: number | boolean;
	setActiveElement: (arg: number | boolean) => void;
	showHeader?: boolean;
	tableClassName: string;
	transactions: TransactionWithGroupData[];
};

export default function ViewStandard({
	showHeader = true,
	tableClassName = '',
	transactions,
}: ViewStandardProps): React.ReactNode {
	return (
		<table className={tableClasses(tableClassName)}>
			{showHeader && (
				<thead>
					<tr className="bg-neutral">
						<th className={thClasses(3)}>Name</th>
						<th className={thClasses(5)}>Description</th>
						<th className={thClasses(1)}>Amount</th>
						<th className={thClasses(1)}>Category</th>
						<th className={thClasses(1)}>Recurring</th>
						<th className={thClasses(1)}>Autopay</th>
					</tr>
				</thead>
			)}

			<tbody>
				{transactions.map((transaction, index) => (
					<tr className={zebra(index, transaction)} key={transaction.uid}>
						<td className={tdClasses(3)}>
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
						<td className={classNames([tdOverflow(), tdClasses(6)])}>
							{transaction.description}
						</td>
						<td className={tdClasses(1)}>{formatAmount(transaction.amount)}</td>
						<td className={tdClasses(1)}>{transaction.category}</td>
						<td className={tdClasses(1)}>{formatRecurring(transaction)}</td>
						<td className={tdClasses(1)}>{transaction.group_recurring_autopay && 'Yes'}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
