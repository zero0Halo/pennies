import type React from 'react';
import classNames from 'classnames';
import type { TransactionWithGroupData } from '@/app/types';
import { formatAmount, formatRecurring, zebra } from '@/utils/app';
import Image from 'next/image';

type ViewStandardProps = {
	activeElement: number | boolean;
	setActiveElement: (arg: number | boolean) => void;
	showCount?: boolean;
	tableClassName: string;
	transactions: TransactionWithGroupData[];
};

export default function ViewStandard({
	showCount = false,
	tableClassName = '',
	transactions,
}: ViewStandardProps): React.ReactNode {
	const tableClasses = classNames(
		'table table-fixed overflow-hidden rounded-lg  mt-0',
		tableClassName,
	);

	return (
		<table className={tableClasses}>
			<thead>
				<tr className="bg-neutral">
					{showCount && <th className="w-1/12" />}
					<th className="text-white text-sm py-1 w-3/12">Name</th>
					<th className={`text-white text-sm py-1 w-${showCount ? 5 : 6}/12`}>
						Description
					</th>
					<th className="text-white text-sm py-1 w-1/12">Amount</th>
					<th className="text-white text-sm py-1 w-1/12">Category</th>
					<th className="text-white text-sm py-1 w-1/12">Recurring</th>
				</tr>
			</thead>

			<tbody>
				{transactions.map((transaction, index) => (
					<tr className={zebra(index, transaction)} key={transaction.uid}>
						{showCount && <td>{index + 1}</td>}
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
						<td
							className={`overflow-x-hidden w-${showCount ? 5 : 6}/12 whitespace-nowrap text-ellipsis`}
						>
							{transaction.description}
						</td>
						<td>{formatAmount(transaction.amount)}</td>
						<td>{transaction.category}</td>
						<td>{formatRecurring(transaction)}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
