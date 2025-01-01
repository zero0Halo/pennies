import React from 'react';
import type { FindGroupsData, TransactionData } from '@/app/types';
import classNames from 'classnames';
import { formatAmount, formatDate, zebra } from '@/utils/app';
import Button from '@/app/components/Button';
import TransactionCreate from '@/app/csv-upload/CsvUpload/TransactionCreate';

type ViewSingletonProps = {
	activeElement: number | boolean;
	setActiveElement: (arg: number | boolean) => void;
	setCSVData?: React.Dispatch<React.SetStateAction<FindGroupsData | undefined>>;
	showCount?: boolean;
	tableClassName: string;
	transactions: TransactionData[];
};

export default function ViewSingleton({
	activeElement,
	setActiveElement,
	setCSVData,
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
					<th className={`text-white text-sm py-1 w-${showCount ? 9 : 8}/12`}>
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
								className={`overflow-x-hidden w-${showCount ? 9 : 8}/12 whitespace-nowrap text-ellipsis`}
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

						{isCreating(index) && setCSVData !== undefined && (
							<tr className="bg-slate-200">
								<td colSpan={showCount ? 5 : 4}>
									<TransactionCreate
										setActiveElement={setActiveElement}
										setCSVData={setCSVData}
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
