import React from 'react';
import type { ParseCSVData, TransactionData } from '@/app/types';
import classNames from 'classnames';
import { formatAmount, formatDate, zebra } from '@/utils/app';
import Button from '@/app/components/Button';
import TransactionCreate from '@/app/csv-upload/TransactionCreate';
import { tableClasses, tdOverflow, thClasses } from '../helpers';

type TransactionsSingletonProps = {
	activeElement: number | boolean | { parent: number; child: number };
	disabled?: boolean;
	setActiveElement: (arg: number | boolean) => void;
	tableClassName: string;
	transactions: TransactionData[];
};

export default function TransactionsSingleton({
	activeElement,
	setActiveElement,
	tableClassName,
	transactions,
}: TransactionsSingletonProps): React.ReactNode {
	// SHUGAH
	const isCreating = (index: number) => index === activeElement;

	return (
		<table className={tableClasses(tableClassName)}>
			<thead>
				<tr className="bg-neutral">
					<th className="w-[20px]" />
					<th className={thClasses(9)}>Description</th>
					<th className={thClasses(1)}>Amount</th>
					<th className={thClasses(2)}>Date</th>
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
							<td>{index + 1}</td>
							<td className={tdOverflow()}>{transaction.description}</td>
							<td>{formatAmount(transaction.amount)}</td>
							<td>{formatDate(transaction.timestamp)}</td>
							<td>
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
							<tr className="bg-slate-200">
								<td colSpan={5}>
									<TransactionCreate
										setActiveElement={setActiveElement}
										transaction={transaction}
									/>
								</td>
							</tr>
						)}
					</React.Fragment>
				))}
			</tbody>
		</table>
	);
}
