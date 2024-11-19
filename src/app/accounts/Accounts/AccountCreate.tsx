'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import Input from '@/app/components/Input';
import Label from '@/app/components/Label';
import Select from '@/app/components/Select';
import { useClientCookie } from '@/app/hooks/client';
import { apiCall } from '@/utils/app';
import { getIsoDate } from '@/utils/general';
import {
	validateAccountData,
	type AccountData,
	type UserData,
} from '@/app/types';
import { accountTypes, USER } from '@/app/constants';

interface AccountCreateProps {
	accountsData: AccountData[];
	setCreatingAccount: (arg: boolean) => void;
}

export default function AccountCreate({
	accountsData,
	setCreatingAccount,
}: AccountCreateProps) {
	const [error, setError] = useState('');
	const [defaultWarning, setDefaultWarning] = useState(false);
	const [success, setSuccess] = useState('');
	const { data: userData, error: userDataError } =
		useClientCookie<UserData>(USER);
	const {
		formState: { errors },
		register,
		handleSubmit,
	} = useForm<AccountData>();

	if (userDataError) {
		console.error(userDataError);
		return null;
	}

	const valid: boolean = validateAccountData(accountsData);

	const defaultAccount =
		valid && accountsData.length > 0
			? accountsData.find((f) => f.is_default)
			: false;
	const noAccounts = valid && accountsData.length === 0;

	async function handleCreateAccount({ is_default, name, type }: AccountData) {
		setError('');

		if (is_default && defaultAccount && !defaultWarning) {
			setDefaultWarning(true);
			return;
		}

		const isoDate = getIsoDate();

		const newAccount: AccountData = {
			created: isoDate,
			is_default: is_default ?? noAccounts,
			name,
			type,
			uid: uuidv4(),
			updated: isoDate,
			user_uid: (userData as UserData).uid,
		};

		apiCall('/api/accounts/create', {
			onError: (msg) => setError(msg),
			onSuccess: (msg) => setSuccess(msg),
			payload: newAccount,
			reload: '/accounts',
		});
	}

	return (
		<form
			className="form-control mb-4"
			onSubmit={handleSubmit(handleCreateAccount)}
		>
			{error.length > 0 && (
				<div className="alert alert-error mb-6 text-white font-bold">
					{error}
				</div>
			)}
			{success.length > 0 && (
				<div className="alert alert-success mb-6 text-white font-bold">
					{success}
				</div>
			)}

			{success.length === 0 && (
				<>
					<Label className={errors?.name ? 'input-error' : ''} htmlFor="name">
						Account Name
						<Input type="text" {...register('name', { required: true })} />
					</Label>

					<Label className={errors?.type ? 'input-error' : ''} htmlFor="type">
						Account Type
						<Select
							options={accountTypes}
							{...register('type', { required: true })}
						/>
					</Label>

					<div className="flex flex-wrap items-center pl-3 pb-4">
						<Label htmlFor="is_default">
							Default Account
							<Input
								type="checkbox"
								defaultChecked={noAccounts}
								disabled={noAccounts}
								{...register('is_default')}
							/>
						</Label>
					</div>

					{defaultWarning && (
						<div className="alert alert-warning mb-8">
							You've set this account to be your default, but there is already a
							default account. If you wish to proceed anyways, click the
							"Submit" button again.
						</div>
					)}

					<div className="join join-horizontal">
						<button
							className="btn btn-warning btn-sm join-item w-1/4"
							onClick={() => setCreatingAccount(false)}
							type="submit"
						>
							Cancel
						</button>

						<button
							type="submit"
							className="btn btn-accent btn-sm join-item w-3/4"
						>
							Submit
						</button>
					</div>
				</>
			)}

			<div className="divider" />
		</form>
	);
}
