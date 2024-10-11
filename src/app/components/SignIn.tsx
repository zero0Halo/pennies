'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface FormDataProps {
	email: string;
	password: string;
}

export default function Login() {
	const { handleSubmit, register } = useForm<FormDataProps>();
	const [success, setSuccess] = useState('');
	const [error, setError] = useState('');

	async function handleSignIn(formData: FormDataProps) {
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
			setError(result.message || 'Sign in failed');
		}
	}

	return (
		<div>
			{success.length > 0 && <h3>{success}</h3>}
			{error.length > 0 && <h3>{error}</h3>}

			{success.length === 0 && (
				<form
					className="form-control join join-horizontal"
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
