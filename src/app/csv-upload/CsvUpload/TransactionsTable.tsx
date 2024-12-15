import { dateFormat, zebra } from '@/utils/app';
import type { TransactionData } from '@/app/types';
import Button from '@/app/components/Button';
import { Fragment, useState } from 'react';
import TransactionRow from './TransactionRow';
import TransactionCreate from './TransactionCreate';

interface TransactionsTableProps {
	className?: string;
	tableClassName?: string;
	transactions: TransactionData[];
}

const displayAmount = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
});

export default function TransactionsTable({
	className = '',
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
									transaction={transaction}
								/>
							</Fragment>
						))}
				</tbody>
			</table>
		</div>
	);
}
