import type {
	TransactionWithDateData,
	TransactionWithGroupData,
} from '@/app/types';
import { dateFormat, zebra } from '@/utils/app';
import displayAmount from '@/utils/app/displayAmount';
import dayjs from 'dayjs';

interface TransactionsMonthProps {
	transactionsData: TransactionWithDateData[];
}

function recurringText(transaction: TransactionWithGroupData): string {
	const { group_recurring, group_still_recurring } = transaction;

	if (typeof group_recurring === 'string' && group_recurring !== 'false') {
		if (group_still_recurring) return group_recurring;
		return 'Ended';
	}

	return '';
}

export default function TransactionsMonth({
	transactionsData,
}: TransactionsMonthProps) {
	const headlineDate = dayjs(transactionsData[0][1][0].timestamp).format(
		'MMMM, YYYY',
	);
	const headlineAccount = transactionsData[0][1][0].account_name;

	return (
		<section>
			<h2>
				Transactions: <span className="text-neutral">{headlineDate}</span>{' '}
				<span className="text-sm">from</span>{' '}
				<span className="text-neutral text-sm">{headlineAccount}</span>
			</h2>

			{transactionsData.map(([dayMeta, transactions]) => (
				<div key={dayMeta.date} className="flex mb-8">
					<div className="relative">
						<div className="badge badge-lg badge-primary py-1 h-7 rounded-l-lg rounded-r-none mr-1 font-bold text-white w-10">
							{dayMeta.date}
						</div>
						<div className="h-7 leading-7 text-xs text-center opacity-80 uppercase">
							{dayMeta.day}
						</div>
					</div>

					<table className="align-top pl-4 table overflow-hidden rounded-lg rounded-tl-none mt-0">
						<thead>
							<tr className="bg-neutral">
								<th className="text-white text-sm py-1 w-6/12">Name</th>
								<th className="text-white text-sm py-1 w-2/12">Amount</th>
								<th className="text-white text-sm py-1 w-2/12">Category</th>
								<th className="text-white text-sm py-1 w-2/12">Recurring</th>
							</tr>
						</thead>

						<tbody>
							{transactions.map((m, index) => (
								<tr key={m.uid} className={zebra(index, m)}>
									<td>{m.group_name || m.description}</td>
									<td>{displayAmount(m.amount)}</td>
									<td>{m.category}</td>
									<td>{recurringText(m)}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			))}
		</section>
	);
}
