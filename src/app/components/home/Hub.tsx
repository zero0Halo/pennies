'use client';

import { MONTHLY_SUMS, MONTHS } from '@/app/constants';
import { useClientCookie, useHub } from '@/app/hooks/client';
import type {
	MonthlySumData,
	TransactionDateMetaData,
	TransactionWithDateData,
	TransactionWithGroupData,
} from '@/app/types';
import { formatAmount } from '@/utils/app';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import Transactions from '../Transactions';
import { getIsoDate } from '@/utils/general';
import useMonthlySumData from '@/app/hooks/client/useMonthlySumLS';

interface HubProps {
	monthName: string;
	transactionsData: TransactionWithDateData[] | undefined;
	year: number;
}

export default function Hub({
	monthName,
	transactionsData,
	year,
}: HubProps): React.ReactNode {
	// SHUGAH
	const month = MONTHS.indexOf(monthName);

	// CUSTOM HOOKS
	const { monthlySumData } = useMonthlySumData({ month, year });
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

	// JSX
	// return (
	// 	<div>
	// 		<h3>{monthlySumData && formatAmount(monthlySumData.sum)}</h3>

	// 		{recurringTransactionsData?.map(([dayMeta, transactions]) => (
	// 			<div key={dayMeta.date} className="flex mb-8">
	// 				<div className="relative">
	// 					<div className="badge badge-lg badge-primary py-1 h-7 rounded-l-lg rounded-r-none mr-1 font-bold text-white w-10">
	// 						{dayMeta.date}
	// 					</div>
	// 					<div className="h-7 leading-7 text-xs text-center opacity-80 uppercase">
	// 						{dayMeta.day}
	// 					</div>
	// 				</div>
	// 				<Transactions
	// 					tableClassName="rounded-tl-none"
	// 					transactions={transactions}
	// 				/>
	// 			</div>
	// 		))}
	// 	</div>
	// );
}
