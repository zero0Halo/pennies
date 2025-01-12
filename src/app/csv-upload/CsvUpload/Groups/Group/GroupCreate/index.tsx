import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import Button from '@/app/components/Button';
import Label from '@/app/components/Label';
import Input from '@/app/components/Input';
import Select from '@/app/components/Select';
import {
	useAccountsCookie,
	useCategories,
	useLoading,
} from '@/app/hooks/client';
import { apiCall } from '@/utils/app';
import formatPayload from './scripts/formatPayload';
import updateState from './scripts/updateState';
import type {
	FindGroupsData,
	TransactionData,
	GroupData,
	CreateTransferPayloadData,
} from '@/app/types';
import { CSV_UPLOAD, TRANSFER } from '@/app/constants';
import { useFormMessagingContext } from '@/app/components/FormMessaging';
import Transactions from '@/app/components/Transactions';

interface GroupCreateProps {
	group: GroupData;
	setActiveElement: React.Dispatch<React.SetStateAction<number | undefined>>;
	setCSVData: React.Dispatch<React.SetStateAction<FindGroupsData | undefined>>;
	transactions: TransactionData[];
}

export default function GroupCreate({
	group,
	setActiveElement,
	setCSVData,
	transactions,
}: GroupCreateProps) {
	const { setError, setSuccess } = useFormMessagingContext();
	const { options } = useAccountsCookie();
	const selectOptions = useMemo(
		() => options.filter((g) => g.value !== group.account_uid),
		[options, group],
	);
	const { categories } = useCategories();
	const { props, setLoading, Loading } = useLoading();
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
			recurring_still: group.recurring_still,
			terms: group.terms,
		},
	});
	const watchRecurring = watch('recurring');
	const watchCategory: string = watch('category');

	// The options are pulled from a cookie, and react-hook-form has problems setting a default value
	// because of it
	React.useEffect(() => {
		if (group.account_uid && options.length) {
			setValue('account_uid', group.account_uid);
		}
		if (watchCategory === TRANSFER && selectOptions.length > 0) {
			setValue('to_account_uid', selectOptions[0].value);
		}
		if (watchCategory !== TRANSFER) {
			setValue('to_account_uid', undefined);
		}
	}, [group.account_uid, options, selectOptions, setValue, watchCategory]);

	async function handleCreateGroup(formData: GroupData) {
		if (Object.keys(errors).length === 0) {
			setLoading(true);

			const payload: CreateTransferPayloadData = formatPayload({
				formData,
				group,
				transactions,
			});

			await apiCall('/api/group/create', {
				onError: (msg) => {
					setLoading(false);
					setError(msg);
				},
				onSuccess: (msg) => {
					setLoading(false);
					setSuccess(msg);
					setCSVData((state) => {
						const updatedState = updateState({
							state,
							payload,
						});

						localStorage.setItem(CSV_UPLOAD, JSON.stringify(updatedState));

						return updatedState;
					});
					setActiveElement(undefined);
				},
				payload,
			});
		}
	}

	return (
		<div className={'bg-primary pt-1 p-8 rounded-lg relative'}>
			<Loading {...props} />

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
						Recurring {group.recurring_type}
						<Input type="checkbox" {...register('recurring')} />
					</Label>

					<Label className="join-item w-1/2" htmlFor="recurring_still">
						Still Recurring
						<Input
							disabled={!watchRecurring}
							type="checkbox"
							{...register('recurring_still')}
						/>
					</Label>
				</div>

				<div className="join join-horizontal mb-4">
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

				<div
					// biome-ignore lint/a11y/noNoninteractiveTabindex: <explanation>
					tabIndex={0}
					className="collapse collapse-plus border-base-300 bg-accent mt-2 mb-6 rounded-xl overflow-hidden border"
				>
					<div className="collapse-title text-md font-bold">Transactions</div>
					<div className="collapse-content">
						<Transactions transactions={transactions} view="grouped" />
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
