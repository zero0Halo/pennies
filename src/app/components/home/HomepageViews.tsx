'use client';

import type {
	AccountData,
	MonthlySumData,
	TransactionWithDateData,
} from '@/app/types';
import type React from 'react';
import { useMemo, useState } from 'react';
import type { ToggleStateData } from '../ButtonToggles';
import Hub from './Hub';
import ButtonToggles from '../ButtonToggles';
import { FormMessagingWrapper } from '../context/FormMessaging';
import TransactionsMonth from '../context/TransactionsMonth/TransactionsMonth';
import getToday from '@/utils/app/getToday';
import { useMonthlySumLS } from '@/app/hooks/client';
import { TransactionsMonthWrapper } from '../context/TransactionsMonth';

const today = getToday();

interface HomepageViewsProps {
	defaultAccount: AccountData | null;
	defaultDate: string;
	defaultMonthlySums: MonthlySumData[] | null;
	defaultTransactionsData: TransactionWithDateData[] | null;
}

export default function HomepageViews({
	defaultAccount,
	defaultDate,
	defaultMonthlySums,
	defaultTransactionsData,
}: HomepageViewsProps): React.ReactNode {
	// STATE
	const [toggleState, setToggleState] = useState<ToggleStateData>({
		today: true,
		month: false,
	});

	// MEMOIZED
	const todaysTransactions = useMemo(() => {
		if (defaultTransactionsData !== null) {
			return defaultTransactionsData.filter(([x]) => x.isToday) ?? null;
		}
		return null;
	}, [defaultTransactionsData]);

	const { monthlySumData } = useMonthlySumLS({
		month: today.month,
		year: today.year,
		_monthlySumsData: defaultMonthlySums,
	});

	// COMPONENT
	return (
		<FormMessagingWrapper>
			<TransactionsMonthWrapper>
				<div className="flex items-center justify-center">
					<ButtonToggles
						className=""
						setToggleState={setToggleState}
						toggleState={toggleState}
					/>
				</div>
				{/* Today View */}
				<section className={toggleState.today ? 'block' : 'hidden'}>
					<Hub
						today={today}
						monthlySumData={monthlySumData}
						transactionsData={todaysTransactions}
					/>
				</section>

				{/* Month View */}
				<section className={toggleState.month ? 'block' : 'hidden'}>
					<TransactionsMonth
						defaultAccount={defaultAccount}
						defaultDate={defaultDate}
						defaultTransactionsData={defaultTransactionsData}
					/>
				</section>
			</TransactionsMonthWrapper>
		</FormMessagingWrapper>
	);
}
