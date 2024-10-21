'use client';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import useClientCookie from '@/app/hooks/useClientCookie';
import { CHECKING, CREDIT_CARD, INVESTMENT, SAVINGS } from '../../constants';
import type { UserData } from '@/app/types';

interface AccountData {
	name: string;
	type: string;
}

export default function CreateAccount() {
	const userData = useClientCookie<UserData>('user');
	const {
		formState: { errors },
		register,
		handleSubmit,
	} = useForm<AccountData>();

	function handleCreateAccount({ name, type }: AccountData) {
		const uid = uuidv4();
		console.log({
			uid,
			name,
			type,
			user_uid:
				typeof userData !== 'boolean' && userData !== undefined
					? userData.uid
					: '',
		});
	}

	if (userData === undefined) return null;

	return (
		<form className="form-control" onSubmit={handleSubmit(handleCreateAccount)}>
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

			<button type="submit" className="btn btn-accent">
				Submit
			</button>
		</form>
	);
}
