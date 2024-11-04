import React from 'react';
import { useForm } from 'react-hook-form';
import type { FindGroupsData, TransactionData, GroupData } from '@/app/types';
import useCategories from '@/app/hooks/useCategories';
import { TransactionsTable } from '../TransactionsTable';
import Button from '@/app/components/Button';
import Label from '@/app/components/Label';
import Input from '@/app/components/Input';
import Select from '@/app/components/Select';

import { CSV_UPLOAD } from '@/app/constants';
import useAccounts from '@/app/hooks/useAccounts';

interface CreateGroupProps {
	group: GroupData;
	setActiveElement: React.Dispatch<React.SetStateAction<number | undefined>>;
	setCSVData: React.Dispatch<React.SetStateAction<FindGroupsData | undefined>>;
	transactions: TransactionData[];
}

export default function CreateGroup({
	group,
	setActiveElement,
	setCSVData,
	transactions,
}: CreateGroupProps) {
	const { categories } = useCategories();
	const { options } = useAccounts();
	const {
		formState: { errors },
		handleSubmit,
		register,
		setValue,
		watch,
	} = useForm<GroupData>({
		defaultValues: {
			account_uid: undefined,
			description: group.description,
			name: '',
			notes: group.notes,
			recurring: group.recurring,
			siteurl: group.siteurl,
			still_recurring: group.still_recurring,
			terms: Array.isArray(group.terms) ? group.terms.join(', ') : group.terms,
		},
	});
	const watchRecurring = watch('recurring');

	// The options are pulled from a cookie, and react-hook-form has problems setting a default value
	// because of it
	React.useEffect(() => {
		if (group.account_uid && options.length) {
			setValue('account_uid', group.account_uid);
		}
	}, [group.account_uid, options, setValue]);

	function handleCreateGroup(formData: GroupData) {
		if (Object.keys(errors).length === 0) {
			// Get the data ready for the payload
			const date = new Date();
			const isoDate = date.toISOString();
			const updatedTransactions: TransactionData[] = transactions.map(
				(transaction) => ({
					...transaction,
					category: formData.category,
					created: isoDate,
					updated: isoDate,
				}),
			);
			const updatedGroup: GroupData = {
				...group,
				...formData,
				created: isoDate,
				prime: updatedTransactions[0].uid,
				updated: isoDate,
			};

			setCSVData((state) => {
				if (state) {
					const newState = {
						groups: [...state.groups],
						singletons: [...state.singletons],
						total: state.total,
					};
					const groupIndex = newState?.groups.findIndex(
						({ group }) => group.uid === updatedGroup.uid,
					);

					newState.groups.splice(groupIndex, 1, {
						group: updatedGroup,
						transactions: updatedTransactions,
					});

					localStorage.setItem(CSV_UPLOAD, JSON.stringify(newState));

					return newState;
				}

				return state;
			});
			setActiveElement(undefined);
		}
	}

	return (
		<div className="bg-secondary pt-1 p-8 rounded-lg">
			<h3>Create Group</h3>

			<form className="form-control" onSubmit={handleSubmit(handleCreateGroup)}>
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

				<Label htmlFor="description">
					Description
					<Input
						className={errors?.description ? 'input-error' : ''}
						type="text"
						{...register('description', { required: true })}
					/>
				</Label>

				<Label htmlFor="terms">
					Terms
					<Input type="text" {...register('terms', { required: true })} />
				</Label>

				<div className="join join-horizontal mb-4">
					<Label className="join-item w-1/2" htmlFor="recurring">
						Recurring {group.recurring}
						<Input type="checkbox" {...register('recurring')} />
					</Label>

					<Label className="join-item w-1/2" htmlFor="still_recurring">
						Still Recurring
						<Input
							disabled={!watchRecurring}
							type="checkbox"
							{...register('still_recurring')}
						/>
					</Label>
				</div>

				<Label htmlFor="category">
					Category
					<Select options={categories} {...register('category')} />
				</Label>

				<Label htmlFor="siteurl">
					Site Url
					<Input type="text" {...register('siteurl')} />
				</Label>

				<Label className="mb-4" htmlFor="notes">
					Notes
					<Input type="text" {...register('notes')} />
				</Label>

				<div
					// biome-ignore lint/a11y/noNoninteractiveTabindex: <explanation>
					tabIndex={0}
					className="collapse collapse-plus border-base-300 bg-accent mt-2 mb-6 rounded-xl overflow-hidden border"
				>
					<div className="collapse-title text-md font-bold">Transactions</div>
					<div className="collapse-content">
						<TransactionsTable transactions={transactions} />
					</div>
				</div>

				<div className="join join-horizontal w-full shadow">
					<Button
						className="btn-warning join-item mr-1 w-1/2"
						onClick={() =>
							typeof setActiveElement === 'function' &&
							setActiveElement(undefined)
						}
					>
						Cancel
					</Button>
					<Button className=" btn-success join-item  w-1/2" type="submit">
						Create Group
					</Button>
				</div>
			</form>
		</div>
	);
}
