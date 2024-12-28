'use client';

import dayjs from 'dayjs';
import { apiCall, displayAmount, zebra } from '@/utils/app';
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

interface TransactionsMonthProps {
	defaultAccount: AccountData | undefined;
	defaultDate: string;
	defaultTransactionsData: TransactionWithDateData[];
}

const months = [...new Array(12)].map((_, i) =>
	dayjs(`${i + 1}-01-2019`).format('MMMM'),
);
const years = [...new Array(20)].map((_, i) => `${i + 2020}`);

function recurringText(transaction: TransactionWithGroupData): string {
	const { group_recurring, group_still_recurring } = transaction;

	if (typeof group_recurring === 'string' && group_recurring !== 'false') {
		if (group_still_recurring) return group_recurring;
		return 'Ended';
	}

	return '';
}

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
			console.log('fired');
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

			<div className="pb-1">
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

					<table className="align-top pl-4 table overflow-hidden rounded-lg rounded-tl-none mt-0">
						<thead>
							<tr className="bg-neutral">
								<th className="text-white text-sm py-1 w-6/12">Name</th>
								<th className="text-white text-sm py-1 w-2/12">Amount</th>
								<th className="text-white text-sm py-1 w-2/12">Category</th>
								<th className="text-white text-sm py-1 w-2/12">Recurring</th>
							</tr>
						</thead>

						<tbody>
							{transactions.map((m, index) => (
								<tr key={m.uid} className={zebra(index, m)}>
									<td>{m.group_name || m.description}</td>
									<td>{displayAmount(m.amount)}</td>
									<td>{m.category}</td>
									<td>{recurringText(m)}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			))}
		</section>
	);
}
