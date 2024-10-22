'use client';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import useClientCookie from '@/app/hooks/useClientCookie';
import { CHECKING, CREDIT_CARD, INVESTMENT, SAVINGS } from '../../constants';
import type { UserData } from '@/app/types';
import { useState } from 'react';

interface AccountData {
	is_default: boolean;
	name: string;
	type: string;
}

export default function AccountCreate() {
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [userData, userDataValid] = useClientCookie<UserData>('user');
	const {
		formState: { errors },
		register,
		handleSubmit,
	} = useForm<AccountData>();
	const firstAccount = userDataValid && !(userData as UserData)?.accounts;

	async function handleCreateAccount({ is_default, name, type }: AccountData) {
		setError('');

		const uid = uuidv4();

		const response = await fetch('/api/account-create', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				is_default: is_default ?? firstAccount,
				name,
				type,
				uid,
				user_uid: (userData as UserData).uid,
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

	if (!userDataValid) return null;

	return (
		<form className="form-control" onSubmit={handleSubmit(handleCreateAccount)}>
			{error.length > 0 && (
				<div className="alert alert-error mb-6"> {error}</div>
			)}
			{success.length > 0 && (
				<div className="alert alert-success"> {success}</div>
			)}

			{success.length === 0 && (
				<>
					<input
						className={`input input-bordered mb-2 ${errors?.name && 'input-error'}`}
						placeholder="Account Name"
						type="text"
						{...register('name', { required: true })}
					/>

					<select
						className={`select select-bordered mb-2 ${errors?.type && 'select-error'}`}
						{...register('type', { required: true })}
					>
						<option />
						<option value={CHECKING}>Checking</option>
						<option value={INVESTMENT}>Credit Card</option>
						<option value={SAVINGS}>Investment</option>
						<option value={CREDIT_CARD}>Savings</option>
					</select>

					<div className="flex flex-wrap items-center pl-3 pb-2">
						<input
							type="checkbox"
							className="checkbox checkbox-sm"
							{...register('is_default')}
							defaultChecked={firstAccount}
							disabled={firstAccount}
						/>

						<label className="pl-2" htmlFor="is_default">
							Default Account
						</label>
					</div>

					<button type="submit" className="btn btn-accent">
						Submit
					</button>
				</>
			)}
		</form>
	);
}
