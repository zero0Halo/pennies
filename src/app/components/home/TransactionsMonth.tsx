import type { TransactionWithDateData } from '@/app/types';
import { dateFormat, zebra } from '@/utils/app';
import displayAmount from '@/utils/app/displayAmount';
import dayjs from 'dayjs';

interface TransactionsMonthProps {
	transactionsData: TransactionWithDateData[];
}

export default function TransactionsMonth({
	transactionsData,
}: TransactionsMonthProps) {
	const headlineDate = dayjs(transactionsData[0][1][0].timestamp).format(
		'MMMM, YYYY',
	);

	return (
		<section>
			<h2>
				Transactions: <span className="text-neutral">{headlineDate}</span>
			</h2>

			{transactionsData.map(([dayMeta, transactions]) => (
				<div key={dayMeta.day} className="flex mb-8">
					<div className="badge badge-lg badge-primary py-1 h-8 rounded-l-lg rounded-r-none mr-1 font-bold text-white">
						{dayMeta.day}
					</div>
					<table className="align-top pl-4 table overflow-hidden rounded-lg rounded-tl-none mt-0">
						<thead>
							<tr className="bg-neutral">
								<th className="text-white text-base py-1 w-6/12">Name</th>
								<th className="text-white text-base py-1 w-3/12">Amount</th>
								<th className="text-white text-base py-1 w-3/12">Category</th>
							</tr>
						</thead>
						<tbody>
							{transactions.map((m, index) => (
								<tr key={m.uid} className={zebra(index, m)}>
									<td>{m.group_name || m.description}</td>
									<td>{displayAmount(m.amount)}</td>
									<td>{m.category}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			))}
		</section>
	);
}
