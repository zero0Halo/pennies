import type { FindGroupsData, TransactionData } from '@/app/types';
import type React from 'react';
import { Fragment, useState } from 'react';
import TransactionRow from './TransactionRow';
import TransactionCreate from './TransactionCreate';

interface TransactionsTableProps {
	className?: string;
	setCSVData: React.Dispatch<React.SetStateAction<FindGroupsData | undefined>>;
	tableClassName?: string;
	transactions: TransactionData[];
}

export default function TransactionsTable({
	className = '',
	setCSVData,
	tableClassName = '',
	transactions,
}: TransactionsTableProps) {
	const [activeElement, setActiveElement] = useState<number | undefined>();
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
							<Fragment key={transaction.uid}>
								<TransactionRow
									activeElement={activeElement}
									creating={activeElement === index}
									index={index}
									setActiveElement={setActiveElement}
									transaction={transaction}
								/>
								<TransactionCreate
									creating={activeElement === index}
									setActiveElement={setActiveElement}
									setCSVData={setCSVData}
									transaction={transaction}
								/>
							</Fragment>
						))}
				</tbody>
			</table>
		</div>
	);
}
