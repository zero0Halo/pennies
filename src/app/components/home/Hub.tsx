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
import useMonthlySumData from '@/app/hooks/client/useMonthlySumDataCookie';

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

	console.log({ monthlySumData });
	return (
		<section>
			<h3>
				{todayDate} {monthName}, {year}
			</h3>

			<div>Day Total: {formatAmount(sumForDate ?? 0)}</div>
			<div>Month Total: {formatAmount(monthlySumData?.sum ?? 0)}</div>

			<h4>Recurring</h4>
			<Transactions transactions={recurring ?? []} view="standard" />

			<div className="divider" />

			<Transactions transactions={transactions ?? []} view="standard" />
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
