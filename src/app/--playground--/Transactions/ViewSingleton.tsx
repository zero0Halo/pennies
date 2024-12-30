import React from 'react';
import type { TransactionData } from '@/app/types';
import classNames from 'classnames';
import { formatAmount, formatDate, zebra } from '@/utils/app';
import Button from '@/app/components/Button';

type ViewSingletonProps = {
	activeElement: number | boolean;
	setActiveElement: (arg: number | boolean) => void;
	showCount?: boolean;
	tableClassName: string;
	transactions: TransactionData[];
};

export default function ViewSingleton({
	activeElement,
	setActiveElement,
	showCount = true,
	tableClassName,
	transactions,
}: ViewSingletonProps): React.ReactNode {
	// SHUGAH
	const tableClasses = classNames(
		'table table-fixed overflow-hidden rounded-lg  mt-0',
		tableClassName,
	);
	const isCreating = (index: number) => index === activeElement;

	return (
		<table className={tableClasses}>
			<thead>
				<tr className="bg-neutral">
					{showCount && <th className="w-1/12" />}
					<th className={`text-white text-sm py-1 w-${showCount ? 8 : 9}/12`}>
						Description
					</th>
					<th className="text-white text-sm py-1 w-1/12">Amount</th>
					<th className="text-white text-sm py-1 w-2/12">Date</th>
					<th className="w-1/12" />
				</tr>
			</thead>

			<tbody>
				{transactions.map((transaction, index) => (
					<React.Fragment key={transaction.uid}>
						<tr
							className={classNames(
								zebra(index, transaction),
								isCreating(index) ? 'hidden' : 'revert',
							)}
						>
							{showCount && <td>{index + 1}</td>}
							<td
								className={`overflow-x-hidden w-${showCount ? 8 : 9}/12 whitespace-nowrap text-ellipsis`}
							>
								{transaction.description}
							</td>
							<td className="w-1/12">{formatAmount(transaction.amount)}</td>
							<td className="w-1/12">{formatDate(transaction.timestamp)}</td>
							<td className="w-1/12">
								<Button
									className="btn-success"
									disabled={typeof activeElement === 'number'}
									onClick={() => setActiveElement(index)}
								>
									Create
								</Button>
							</td>
						</tr>

						{isCreating(index) && (
							<tr>
								<td colSpan={5}>
									<Button
										className="btn-warning"
										onClick={() => setActiveElement(false)}
									>
										Cancel
									</Button>
								</td>
							</tr>
						)}
					</React.Fragment>
				))}
			</tbody>
		</table>
	);
}
