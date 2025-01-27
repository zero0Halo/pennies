'use client';

import dayjs from 'dayjs';
import { apiCall, formatAmount } from '@/utils/app';
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
import StatRow from '../StatRow';
import classNames from 'classnames';

interface TransactionsMonthProps {
	defaultAccount: AccountData | null;
	defaultDate: string;
	defaultTransactionsData: TransactionWithDateData[] | null;
}

// COMPONENT
export default function TransactionsMonth({
	defaultAccount,
	defaultDate,
	defaultTransactionsData,
}: TransactionsMonthProps) {
	if (defaultAccount === null) return null;

	// STATE
	const [activeElement, setActiveElement] = useState<
		boolean | { parent: number; child: number }
	>(false);

	// CONTEXT
	const { setError, setSuccess } = useFormMessagingContext();

	// STATE
	const [transactionsData, setTransactionsData] = useState(
		defaultTransactionsData,
	);

	// REACT FORM
	const { getValues, register, setValue, watch } = useForm();

	// CUSTOM HOOKS
	const { getAccountByUid, options: accountOptions } = useAccountsCookie();
	const { Loading, props, setLoading } = useLoading();
	const { monthlySumData } = useMonthlySumLS({
		month: MONTHS.indexOf(getValues('month')),
		year: +getValues('year'),
	});

	// MEMO
	const sum: number | boolean = useMemo(() => {
		if (!transactionsData || transactionsData.length === 0) return 0;

		let _sum = transactionsData
			.map(([_, transactions]) => transactions)
			.reduce(
				// biome-ignore lint/performance/noAccumulatingSpread: <explanation>
				(acc, arrayOfTransactions) => [...acc, ...arrayOfTransactions],
				[],
			)
			.reduce((acc, { amount }) => acc + amount, 0);
		_sum = Number(_sum.toFixed(2));

		if (monthlySumData?.sum !== _sum) {
			console.error(`Values do not match: ${_sum} and ${monthlySumData?.sum}`);
			return false;
		}

		return _sum;
	}, [monthlySumData?.sum, transactionsData]);

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
			if (!response.error) {
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
		const response = await apiCall<TransactionWithDateData[]>(
			'/api/transactions/select/by-day',
			{
				payload: {
					account_uid: account,
					date: `${MONTHS[updatedMonth]} ${updatedYear}`,
				},
			},
		);

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

	// SHUGAH
	const statsArray = [
		{ label: 'Month', value: `${getValues('month')}, ${getValues('year')}` },
		{
			label: 'Account',
			value: `${accountOptions.length > 1 && getAccountByUid(watch('account'))?.name}`,
		},
		{
			label: 'Month Total',
			value: sum === false ? 'Incorrect Match' : formatAmount(sum),
		},
	];

	// JSX
	return (
		<section className="relative">
			<Loading {...props} />

			<FormMessaging />

			<StatRow stats={statsArray} />

			{/* TOGGLES & BUTTONS */}
			<div className="pb-2 mb-6 flex">
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

				<div className="join ml-auto">
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

			{/* Month View */}
			<section>
				{transactionsData?.map(([dayMeta, transactions]) => {
					// Because there are multiple Transaction components being displayed there is logic for
					// Both the parent Transaction and its children to be disabled
					const disabled =
						typeof activeElement === 'object' &&
						activeElement.parent !== dayMeta.date;
					const disabledClasses = disabled
						? 'opacity-50 pointer-events-none'
						: '';
					const fn = (val: number | boolean) =>
						setActiveElement(
							typeof val === 'boolean'
								? val
								: { parent: dayMeta.date, child: val },
						);

					return (
						<div
							key={dayMeta.date}
							className={classNames('flex mb-8', disabledClasses)}
						>
							<div className="relative">
								<div className="badge badge-lg badge-primary py-1 h-7 rounded-l-lg rounded-r-none mr-1 font-bold text-white w-10">
									{dayMeta.date}
								</div>
								<div className="h-7 leading-7 text-xs text-center opacity-80 uppercase">
									{dayMeta.day}
								</div>
							</div>

							<Transactions
								activeElement={activeElement}
								disabled={disabled}
								setActiveElement={fn}
								tableClassName="rounded-tl-none"
								transactions={transactions}
							/>
						</div>
					);
				})}

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
