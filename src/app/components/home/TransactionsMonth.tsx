import type { TransactionWithDateData } from '@/app/types';
import { dateFormat } from '@/utils/app';
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
					<div className="badge badge-lg badge-outline badge-black shadow-md mt-2">
						{dayMeta.day}
					</div>
					<div className="align-top pl-4">
						{transactions.map((m) => (
							<div key={m.uid}>
								<h3 className="mt-0">{m.group_name}</h3>
								<h4>{m.description}</h4>
								<strong>{dateFormat(m.timestamp)}</strong>
							</div>
						))}
					</div>
				</div>
			))}
		</section>
	);
}
