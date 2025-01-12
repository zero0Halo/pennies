'use client';

import type React from 'react';
import { useHub } from '@/app/hooks/client';
import Transactions from '../Transactions';
import { formatAmount } from '@/utils/app';
import type { MonthlySumData, TransactionWithDateData } from '@/app/types';
import { MONTHS } from '@/app/constants';

interface HubProps {
	monthName: string;
	monthlySumData: MonthlySumData | undefined;
	transactionsData: TransactionWithDateData[] | undefined;
	year: number;
}

export default function Hub({
	monthName,
	monthlySumData,
	transactionsData,
	year,
}: HubProps): React.ReactNode {
	// SHUGAH
	const month = MONTHS.indexOf(monthName);

	// CUSTOM HOOKS
	const { recurring, sumForDate, todayDate, transactions } = useHub({
		transactionsData,
	});

	const statsArray = [
		{ label: 'Day', value: `${todayDate} ${monthName}, ${year}` },
		{ label: 'Day Total', value: formatAmount(sumForDate ?? 0) },
		{
			label: 'Month Total',
			value: formatAmount(monthlySumData?.sum ?? 0),
		},
	];

	return (
		<section>
			<div className="stats w-full bg-black text-white my-4">
				{statsArray.map((stat) => (
					<div className="stat" key={stat.label}>
						<span className="stat-title text-white">{stat.label}</span>
						<span className="stat-value text-white">{stat.value}</span>
					</div>
				))}
			</div>

			<h4>Recurring</h4>
			<Transactions transactions={recurring ?? []} view="standard" />
			{!recurring && <h5>None</h5>}

			<div className="divider" />

			<h4>Singletons</h4>
			<Transactions transactions={transactions ?? []} view="standard" />
			{!transactions && <h5>None</h5>}
		</section>
	);
}
