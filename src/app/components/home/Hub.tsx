import { MONTHLY_SUMS } from '@/app/constants';
import { useClientCookie } from '@/app/hooks/client';
import type {
	MonthlySumData,
	TransactionWithDateData,
	TransactionWithGroupData,
} from '@/app/types';
import { formatAmount } from '@/utils/app';
import type React from 'react';
import { useMemo } from 'react';
import Transactions from '../Transactions';

interface HubProps {
	month: number;
	transactionsData: TransactionWithDateData[] | undefined;
	year: number;
}

export default function Hub({
	month,
	transactionsData,
	year,
}: HubProps): React.ReactNode {
	const { data, error } = useClientCookie<MonthlySumData[]>(MONTHLY_SUMS);
	const monthlySumData = data
		? data.find(({ month_uid_key }) => {
				const [m, y] = month_uid_key.split('-').map((m) => +m);

				console.log({ month, m, year, y });

				return m === +month && y === year;
			})
		: false;

	const recurringTransactionsData: TransactionWithDateData[] | undefined =
		transactionsData
			?.filter(([_, transactions]) => {
				const onlyRecurring = transactions.filter(
					({ group_recurring }) => group_recurring,
				);
				return onlyRecurring.length;
			})
			.map(([dates, transactions]) => [
				dates,
				transactions.filter(({ group_recurring }) => group_recurring),
			]);

	// JSX
	return (
		<div>
			<h3>{monthlySumData && formatAmount(monthlySumData.sum)}</h3>

			{recurringTransactionsData?.map(([dayMeta, transactions], index) => (
				<div key={dayMeta.date} className="flex mb-8">
					<div className="relative pt-8">
						<div className="badge badge-lg badge-primary py-1 h-7 rounded-l-lg rounded-r-none mr-1 font-bold text-white w-10">
							{dayMeta.date}
						</div>
						<div className="h-7 leading-7 text-xs text-center opacity-80 uppercase">
							{dayMeta.day}
						</div>
					</div>
					<Transactions
						showHeader={index === 0}
						transactions={transactions}
						view="standard"
					/>
				</div>
			))}
		</div>
	);
}
