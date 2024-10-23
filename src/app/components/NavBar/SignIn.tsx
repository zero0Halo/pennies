'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { SignInData } from '../../types';

export default function Login() {
	const { handleSubmit, register } = useForm<SignInData>();
	const [success, setSuccess] = useState('');
	const [error, setError] = useState('');

	async function handleSignIn(formData: SignInData) {
		const response = await fetch('/api/user-signin', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email: formData.email,
				password: formData.password,
			}),
		});

		const result = await response.json();

		if (response.ok) {
			setSuccess(result.message);
			setTimeout(() => {
				window.location.href = '/';
			}, 2000);
		} else {
			const dataMessage = result?.data?.message
				? ` (${result.data.message})`
				: '';
			setError(`${result.message}${dataMessage}`);
			console.error(result);
		}
	}

	return (
		<div>
			{success.length > 0 && (
				<div className="alert alert-success px-y py-2 font-bold text-white">
					{success}
				</div>
			)}
			{error.length > 0 && (
				<div className="alert alert-error px-y py-2 font-bold text-white">
					{error}
				</div>
			)}

			{success.length === 0 && (
				<form
					className="form-control join join-horizontal ml-2"
					onSubmit={handleSubmit(handleSignIn)}
				>
					<input
						className="input input-xs join-item input-bordered"
						placeholder="Email"
						type="text"
						{...register('email', { required: true })}
					/>

					<input
						className="input input-xs join-item input-bordered"
						placeholder="Password"
						type="password"
						{...register('password', { required: true })}
					/>

					<button className="btn btn-primary btn-xs join-item" type="submit">
						Submit
					</button>
				</form>
			)}
		</div>
	);
}
