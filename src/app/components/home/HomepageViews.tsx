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
import { FormMessagingWrapper } from '../FormMessaging';
import TransactionsMonth from './TransactionsMonth';
import getToday from '@/utils/app/getToday';
import { useMonthlySumLS } from '@/app/hooks/client';

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
	const [toggleState, setToggleState] = useState<ToggleStateData>({
		today: true,
		month: false,
	});

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

	return (
		<FormMessagingWrapper>
			<ButtonToggles
				className="mx-auto my-0 self-end"
				setToggleState={setToggleState}
				toggleState={toggleState}
			/>

			{/* Today View */}
			<section className={toggleState.today ? 'block' : 'hidden'}>
				<Hub
					today={today}
					monthlySumData={monthlySumData}
					transactionsData={todaysTransactions}
				/>
			</section>

			<section className={toggleState.month ? 'block' : 'hidden'}>
				<TransactionsMonth
					defaultAccount={defaultAccount}
					defaultDate={defaultDate}
					defaultTransactionsData={defaultTransactionsData}
				/>
			</section>
		</FormMessagingWrapper>
	);
}
