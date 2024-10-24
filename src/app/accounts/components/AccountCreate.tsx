'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import useClientCookie from '@/app/hooks/useClientCookie';
import { USER } from '../../constants';
import type { AccountData, AccountDBData, UserData } from '@/app/types';
import SelectType from './SelectType';

interface AccountCreateProps {
	accountsData: AccountDBData[];
	setCreatingAccount: (arg: boolean) => void;
}

export default function AccountCreate({
	accountsData,
	setCreatingAccount,
}: AccountCreateProps) {
	const [error, setError] = useState('');
	const [defaultWarning, setDefaultWarning] = useState(false);
	const [success, setSuccess] = useState('');
	const [userCookieData] = useClientCookie<UserData>(USER);
	const {
		formState: { errors },
		register,
		handleSubmit,
	} = useForm<AccountData>();

	const defaultAccount =
		Array.isArray(accountsData) && accountsData.length > 0
			? accountsData.find((f) => f.is_default)
			: false;
	const noAccounts = Array.isArray(accountsData) && accountsData.length === 0;

	async function handleCreateAccount({ is_default, name, type }: AccountData) {
		setError('');

		if (is_default && defaultAccount && !defaultWarning) {
			setDefaultWarning(true);
			return;
		}

		const uid = uuidv4();

		const response = await fetch('/api/account-create', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				is_default: is_default ?? noAccounts,
				name,
				type,
				uid,
				user_uid: (userCookieData as UserData).uid,
			}),
		});

		if (response.ok) {
			setSuccess('Account Created Successfully. Refreshing...');
			setTimeout(() => {
				window.location.href = '/accounts';
			}, 2000);
		} else {
			const body = await response.json();
			setError(`${body.message}: ${body?.data?.message ?? ''}`);
		}
	}

	if (!userCookieData) return null;

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
					<input
						className={`input input-sm input-bordered mb-2 ${errors?.name && 'input-error'}`}
						placeholder="Account Name"
						type="text"
						{...register('name', { required: true })}
					/>

					<SelectType
						className="mb-2"
						error={errors?.type}
						register={register}
					/>

					<div className="flex flex-wrap items-center pl-3 pb-4">
						<input
							type="checkbox"
							className="checkbox checkbox-sm"
							{...register('is_default')}
							defaultChecked={noAccounts}
							disabled={noAccounts}
						/>

						<label className="pl-2" htmlFor="is_default">
							Default Account
						</label>
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
