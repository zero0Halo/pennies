'use client';

import dayjs from 'dayjs';
import { apiCall } from '@/utils/app';
import type { AccountData, TransactionWithDateData } from '@/app/types';
import {
	useAccountsCookie,
	useLoading,
	useMonthlySumLS,
} from '@/app/hooks/client';
import Select from '../Select';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../Button';
import Transactions from '@/app/components/Transactions';
import { MONTHS, YEARS } from '@/app/constants';
import { FormMessaging, useFormMessagingContext } from '../FormMessaging';
import Hub from './Hub';
import ButtonToggles, { type ToggleStateData } from '../ButtonToggles';

interface TransactionsMonthProps {
	defaultAccount: AccountData | undefined;
	defaultDate: string;
	defaultTransactionsData: TransactionWithDateData[];
}

// COMPONENT
export default function TransactionsMonth({
	defaultAccount,
	defaultDate,
	defaultTransactionsData,
}: TransactionsMonthProps) {
	if (defaultAccount === undefined) return null;

	// CONTEXT
	const { setError, setSuccess } = useFormMessagingContext();

	// STATE
	const [transactionsData, setTransactionsData] = useState(
		defaultTransactionsData,
	);
	const [toggleState, setToggleState] = useState<ToggleStateData>({
		today: true,
		month: false,
	});

	// Memo
	const sum = useMemo(() => {
		if (!transactionsData || transactionsData.length === 0) return 0;

		return transactionsData
			.map(([_, transactions]) => transactions)
			.reduce(
				// biome-ignore lint/performance/noAccumulatingSpread: <explanation>
				(acc, arrayOfTransactions) => [...acc, ...arrayOfTransactions],
				[],
			)
			.reduce((acc, { amount }) => acc + amount, 0);
	}, [transactionsData]);

	// REACT FORM
	const { getValues, register, setValue, watch } = useForm();

	// CUSTOM MHOOKS
	const { getAccountByUid, options: accountOptions } = useAccountsCookie();
	const { Loading, props, setLoading } = useLoading();
	const { monthlySumData } = useMonthlySumLS({
		month: getValues('month'),
		year: getValues('year'),
	});

	// EFFECTS
	useEffect(() => {
		const account = getValues('account');

		if (account === '' && accountOptions.length > 1) {
			const date = dayjs(defaultDate).format('MMMM, YYYY');
			const [month, year] = date.split(', ');

			setValue('month', month);
			setValue('year', year);
			setValue('account', defaultAccount.uid);
		}
	}, [defaultAccount, defaultDate, getValues, accountOptions, setValue]);

	// HANDLERS
	const handleGetTransactions = async () => {
		// setLoading(true);

		const account = getValues('account');
		const month = getValues('month');
		const year = getValues('year');

		const response = await apiCall('/api/transactions/select/by-day', {
			payload: { account_uid: account, date: `${month} ${year}` },
		});

		setLoading(false, () => {
			if (response.data) {
				setTransactionsData(response.data);
				setSuccess('Successfully Retrieved Transactions');
			} else if (response.error) {
				setError('Error Retreieving Transactions');
			}
		});
	};

	const handleMonthStep = async (step: number) => {
		setLoading(true);

		const account = getValues('account');
		const month = getValues('month');
		const year = getValues('year');
		let updatedMonth = MONTHS.indexOf(month) + step;
		let updatedYear = +year;

		if (updatedMonth > 11) {
			updatedMonth = 0;
			updatedYear += 1;
		} else if (updatedMonth < 0) {
			updatedMonth = 11;
			updatedYear -= 1;
		}

		const response = await apiCall('/api/transactions/select/by-day', {
			payload: {
				account_uid: account,
				date: `${MONTHS[updatedMonth]} ${updatedYear}`,
			},
		});

		setLoading(false, () => {
			if (response.data) {
				setTransactionsData(response.data);
				setValue('month', MONTHS[updatedMonth]);
				setValue('year', updatedYear);
				setSuccess(
					`Successfully Retrieved Transactions for ${MONTHS[updatedMonth]} ${updatedYear}`,
				);
			} else if (response.error) {
				setError('Error Retreieving Transactions');
			}
		});
	};

	// JSX
	return (
		<section className="relative">
			<Loading {...props} />

			<FormMessaging />

			<h2>
				Transactions:{' '}
				<span className="text-neutral">
					{watch('month')}, {watch('year')}
				</span>{' '}
				<span className="text-sm">from</span>{' '}
				<span className="text-neutral text-sm">
					{accountOptions.length > 1 && getAccountByUid(watch('account'))?.name}
				</span>
			</h2>

			<div className="pb-2 flex">
				<div className="self-end join join-horizontal">
					<Select
						className="select-primary join-item select-xs"
						options={accountOptions}
						{...register('account')}
					/>
					<Select
						className="select-primary join-item select-xs"
						options={MONTHS}
						{...register('month')}
					/>
					<Select
						className="select-primary join-item select-xs"
						options={YEARS}
						{...register('year')}
					/>
					<Button
						className="btn-primary btn-xs text-black  join-item"
						onClick={handleGetTransactions}
					>
						Go
					</Button>
				</div>

				<ButtonToggles
					className="mx-auto my-0 self-end"
					setToggleState={setToggleState}
					toggleState={toggleState}
				/>

				<div className="join">
					<Button
						className="join-item bg-primary btn-xs self-end text-black"
						onClick={() => handleMonthStep(-1)}
					>
						Prev
					</Button>
					<Button
						className="join-item bg-primary btn-xs self-end text-black"
						onClick={() => handleMonthStep(1)}
					>
						Next
					</Button>
				</div>
			</div>

			{/* Today View */}
			<section className={toggleState.today ? 'block' : 'hidden'}>
				<Hub
					monthName={getValues('month')}
					monthlySumData={monthlySumData}
					transactionsData={transactionsData}
					year={+getValues('year')}
				/>
			</section>

			{/* Month View */}
			<section className={toggleState.month ? 'block' : 'hidden'}>
				{transactionsData.map(([dayMeta, transactions]) => (
					<div key={dayMeta.date} className="flex mb-8">
						<div className="relative">
							<div className="badge badge-lg badge-primary py-1 h-7 rounded-l-lg rounded-r-none mr-1 font-bold text-white w-10">
								{dayMeta.date}
							</div>
							<div className="h-7 leading-7 text-xs text-center opacity-80 uppercase">
								{dayMeta.day}
							</div>
						</div>
						<Transactions
							tableClassName="rounded-tl-none"
							transactions={transactions}
						/>
					</div>
				))}

				{!transactionsData ||
					(transactionsData.length === 0 && (
						<>
							<h4>Transactions</h4>
							<h5>None</h5>
						</>
					))}
			</section>
		</section>
	);
}
