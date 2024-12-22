'use client';

import type React from 'react';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { produce } from 'immer';
import Button from '@/app/components/Button';
import Input from '@/app/components/Input';
import Label from '@/app/components/Label';
import Select from '@/app/components/Select';
import { TRANSFER } from '@/app/constants';
import { useAccounts, useCategories, useLoading } from '@/app/hooks/client';
import type { FindGroupsData, TransactionData } from '@/app/types';
import { apiCall, dateFormat, displayAmount } from '@/utils/app';
import { useFormMessagingContext } from '@/app/components/FormMessaging';

interface TransactionCreateProps {
	creating: boolean;
	setActiveElement: (arg: undefined) => void;
	setCSVData: React.Dispatch<React.SetStateAction<FindGroupsData | undefined>>;
	transaction: TransactionData;
}

export default function TransactionCreate({
	creating,
	setActiveElement,
	setCSVData,
	transaction,
}: TransactionCreateProps) {
	if (!creating) return null;

	const { setError, setSuccess } = useFormMessagingContext();
	const { options } = useAccounts();
	const { Loading, props, setLoading } = useLoading();
	const selectOptions = useMemo(
		() => options.filter((g) => g.value !== transaction.account_uid),
		[options, transaction],
	);
	const { categories } = useCategories();
	const {
		formState: { errors },
		handleSubmit,
		register,
		setValue,
		watch,
	} = useForm<TransactionData>({
		defaultValues: {
			account_uid: undefined,
			category: '',
			name: '',
			terms: Array.isArray(transaction.terms)
				? transaction.terms.join(', ')
				: transaction.terms,
		},
	});
	const watchCategory: string = watch('category');

	// The options are pulled from a cookie, and react-hook-form has problems setting a default value
	// because of it
	useEffect(() => {
		if (transaction.account_uid && options.length) {
			setValue('account_uid', transaction.account_uid);
		}
		if (watchCategory === TRANSFER && selectOptions.length > 0) {
			setValue('to_account_uid', selectOptions[0].value);
		}
		if (watchCategory !== TRANSFER) {
			setValue('to_account_uid', undefined);
		}
	}, [
		transaction.account_uid,
		options,
		selectOptions,
		setValue,
		watchCategory,
	]);

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const handleTransactionCreate = async (x: any) => {
		setLoading(true);

		const payload = { ...transaction, ...x, terms: x.terms.split(', ') };
		const result = await apiCall('/api/transactions/create', { payload });

		if (result?.error) {
			setError(result.message);
			setLoading(false);
			return;
		}

		setLoading(false);
		setSuccess(`Transaction "${x.name}" created successfully!`);

		setCSVData((state) => {
			const transactionIndex = state?.singletons.findIndex(
				(f) => f.uid === transaction.uid,
			);
			const updatedState = produce(state, (draft) => {
				if (draft !== undefined && transactionIndex !== undefined)
					draft.singletons[transactionIndex] = payload;
			});
			// console.log({ updatedState });
			return updatedState;
		});
	};

	return (
		<tr>
			<td colSpan={4}>
				<div className={'bg-primary pt-1 p-8 rounded-lg relative'}>
					<Loading {...props} />

					<h3>Create Transaction</h3>

					<form
						className="form-control"
						onSubmit={handleSubmit(handleTransactionCreate)}
					>
						<Label htmlFor="description">
							Description
							<Input disabled type="text" value={transaction.description} />
						</Label>

						<Label htmlFor="description">
							Date
							<Input
								disabled
								type="text"
								value={dateFormat(transaction.timestamp)}
							/>
						</Label>

						<Label className="mb-6" htmlFor="description">
							Amount
							<Input
								disabled
								type="text"
								value={displayAmount(transaction.amount)}
							/>
						</Label>

						<Label htmlFor="name">
							Name
							<Input
								className={errors?.name ? 'input-error' : ''}
								type="text"
								{...register('name', { required: true })}
							/>
						</Label>

						<Label htmlFor="account">
							Account
							<Select
								options={options}
								{...register('account_uid', { required: true })}
							/>
						</Label>

						<Label htmlFor="terms">
							Terms
							<Input type="text" {...register('terms', { required: true })} />
						</Label>

						<div className="join join-horizontal">
							<Label className="join-item w-1/2" htmlFor="category">
								Category
								<Select options={categories} {...register('category')} />
							</Label>

							{selectOptions.length > 0 && (
								<Label className="join-item w-1/2" htmlFor="to_account_uid">
									Transfer To
									<Select
										disabled={watchCategory !== TRANSFER}
										options={selectOptions}
										{...register('to_account_uid')}
									/>
								</Label>
							)}
						</div>

						<Label htmlFor="siteurl">
							Site Url
							<Input type="text" {...register('siteurl')} />
						</Label>

						<Label className="mb-4" htmlFor="notes">
							Notes
							<Input type="text" {...register('notes')} />
						</Label>

						<div className="join join-horizontal w-full">
							<Button
								className="join-item btn-warning mr-1 w-1/2"
								onClick={() => setActiveElement(undefined)}
							>
								Cancel
							</Button>
							<Button className="join-item btn-success w-1/2" type="submit">
								Create Transaction
							</Button>
						</div>
					</form>
				</div>
			</td>
		</tr>
	);
}
