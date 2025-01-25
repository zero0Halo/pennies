'use client';

import type React from 'react';
import { useHub } from '@/app/hooks/client';
import Transactions from '../Transactions';
import { formatAmount } from '@/utils/app';
import type { MonthlySumData, TransactionWithDateData } from '@/app/types';
import StatRow from '../StatRow';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import { MONTHS } from '@/app/constants';

interface HubProps {
	monthName: string;
	monthlySumData: MonthlySumData | null;
	transactionsData: TransactionWithDateData[] | null;
	year: number;
}

export type TodayData = {
	date: number;
	month: number;
	monthName: string;
	year: number;
};

// COMPONENT
export default function Hub({
	monthlySumData,
	transactionsData,
}: HubProps): React.ReactNode {
	// MEMO
	const today = useMemo<TodayData>(() => {
		const arr = dayjs()
			.format('D MM YYYY')
			.split(' ')
			.map((m) => +m);
		return {
			date: arr[0],
			month: arr[1],
			monthName: MONTHS[arr[1]],
			year: arr[2],
		};
	}, []);

	// CUSTOM HOOKS
	const { noAutopay, recurring, sumForDate, transactions } = useHub({
		today,
		transactionsData,
	});

	// SHUGAH
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

		{ label: 'Day', value: `${today.date} ${today.monthName}, ${today.year}` },
		{ label: 'Day Total', value: formatAmount(sumForDate ?? 0) },
		{
			label: 'Month Total',
			value: formatAmount(monthlySumData?.sum ?? 0),
		},
	];

	// JSX
	return (
		<section>
			<StatRow stats={statsArray} />

			<Transactions
				className="!overflow-visible p-3 border-double border-accent border-8 rounded-xl shadow-lg bg-neutral-100 mt-4 mb-7"
				title="Pay Today!"
				transactions={noAutopay || []}
				view="standard"
			/>

			<div className="divider" />

			<Transactions
				showNone
				title="Recurring"
				transactions={recurring || []}
				view="standard"
			/>

			<div className="divider" />

			<Transactions
				showNone
				title="Singletons"
				transactions={transactions || []}
				view="standard"
			/>
		</section>
	);
}
