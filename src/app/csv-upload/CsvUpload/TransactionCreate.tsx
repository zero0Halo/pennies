import Button from '@/app/components/Button';
import Input from '@/app/components/Input';
import Label from '@/app/components/Label';
import Select from '@/app/components/Select';
import { TRANSFER } from '@/app/constants';
import { useAccounts, useCategories } from '@/app/hooks/client';
import type { TransactionData } from '@/app/types';
import { dateFormat, displayAmount } from '@/utils/app';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

interface TransactionCreateProps {
	creating: boolean;
	setActiveElement: (arg: undefined) => void;
	transaction: TransactionData;
}

export default function TransactionCreate({
	creating,
	setActiveElement,
	transaction,
}: TransactionCreateProps) {
	if (!creating) return null;

	const { options } = useAccounts();
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
	const handleTransactionCreate = (x: any) => {
		console.log({ ...transaction, ...x });
	};

	return (
		<tr>
			<td colSpan={4}>
				<div className={'bg-primary pt-1 p-8 rounded-lg relative'}>
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
