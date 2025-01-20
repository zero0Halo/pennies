'use client';

import type React from 'react';
import { useHub } from '@/app/hooks/client';
import Transactions from '../Transactions';
import { formatAmount } from '@/utils/app';
import type { MonthlySumData, TransactionWithDateData } from '@/app/types';
import StatRow from '../StatRow';

interface HubProps {
	monthName: string;
	monthlySumData: MonthlySumData | null;
	transactionsData: TransactionWithDateData[] | null;
	year: number;
}

export default function Hub({
	monthName,
	monthlySumData,
	transactionsData,
	year,
}: HubProps): React.ReactNode {
	// CUSTOM HOOKS
	const { noAutopay, recurring, sumForDate, today, transactions } = useHub({
		transactionsData,
	});

	const statsArray = [
		{
			label: {
				className: '!text-accent font-bold',
				displayText: 'Today',
			},
			value: {
				className: '!text-accent font-bold',
				displayText: `${today.date} ${today.monthName}, ${today.year}`,
			},
		},

		{ label: 'Day', value: `${today.date} ${monthName}, ${year}` },
		{ label: 'Day Total', value: formatAmount(sumForDate ?? 0) },
		{
			label: 'Month Total',
			value: formatAmount(monthlySumData?.sum ?? 0),
		},
	];

	return (
		<section>
			<StatRow stats={statsArray} />

			<h4>Manual Pay</h4>
			<Transactions transactions={noAutopay || []} view="standard" />
			{!noAutopay && <h5>None</h5>}

			<div className="divider" />

			<h4>Recurring</h4>
			<Transactions transactions={recurring || []} view="standard" />
			{!recurring && <h5>None</h5>}

			<div className="divider" />

			<h4>Singletons</h4>
			<Transactions transactions={transactions || []} view="standard" />
			{!transactions && <h5>None</h5>}
		</section>
	);
}
