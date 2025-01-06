'use client';

import dayjs from 'dayjs';
import { apiCall } from '@/utils/app';
import type {
	AccountData,
	TransactionWithDateData,
	TransactionWithGroupData,
} from '@/app/types';
import { useAccounts } from '@/app/hooks/client';
import Select from '../Select';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../Button';
import Transactions from '@/app/components/Transactions';

interface TransactionsMonthProps {
	defaultAccount: AccountData | undefined;
	defaultDate: string;
	defaultTransactionsData: TransactionWithDateData[];
}

const months = [...new Array(12)].map((_, i) =>
	dayjs(`${i + 1}-01-2019`).format('MMMM'),
);
const years = [...new Array(20)].map((_, i) => `${i + 2020}`);

// COMPONENTS
export default function TransactionsMonth({
	defaultAccount,
	defaultDate,
	defaultTransactionsData,
}: TransactionsMonthProps) {
	if (defaultAccount === undefined) return null;

	// STATE
	const [transactionsData, setTransactionsData] = useState(
		defaultTransactionsData,
	);

	// CUSTOM MHOOKS
	const { getAccountByUid, options: accountOptions } = useAccounts();

	// REACT FORM
	const { getValues, register, setValue, watch } = useForm();

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
		const account = getValues('account');
		const month = getValues('month');
		const year = getValues('year');

		const response = await apiCall('/api/transactions/select/by-day', {
			payload: { account_uid: account, date: `${month} ${year}` },
		});

		if (response.data) {
			setTransactionsData(response.data);
		}
	};

	const handleMonthStep = async (step: number) => {
		const account = getValues('account');
		const month = getValues('month');
		const year = getValues('year');
		let updatedMonth = months.indexOf(month) + step;
		let updatedYear = +year;

		if (updatedMonth > 11) {
			updatedMonth = 0;
			updatedYear += 1;
		} else if (updatedMonth < 0) {
			updatedMonth = 11;
			updatedYear -= 1;
		}

		setValue('month', months[updatedMonth]);
		setValue('year', updatedYear);

		const response = await apiCall('/api/transactions/select/by-day', {
			payload: {
				account_uid: account,
				date: `${months[updatedMonth]} ${updatedYear}`,
			},
		});

		if (response.data) {
			setTransactionsData(response.data);
		}
	};

	return (
		<section>
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

			<div className="pb-1 flex">
				<div>
					<Select options={accountOptions} {...register('account')} />
					<Select options={months} {...register('month')} />
					<Select options={years} {...register('year')} />
					<Button
						className="btn-primary btn-xs text-black"
						onClick={handleGetTransactions}
					>
						Go
					</Button>
				</div>

				<div className="ml-auto join">
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
		</section>
	);
}
