'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import type { SignUpData } from '../../types';

function SignUpForm() {
	const [success, setSuccess] = useState('');
	const [error, setError] = useState('');
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignUpData>();

	const handleSignUp = async (formData: SignUpData) => {
		const response = await fetch('/api/user-signup', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email: formData.email,
				firstname: formData.firstname,
				lastname: formData.lastname,
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
			setError(result.message || 'Sign up failed');
		}
	};

	return (
		<div>
			{success.length > 0 && <h3>{success}</h3>}
			{error.length > 0 && <h3>{error}</h3>}

			{success.length === 0 && (
				<form
					className="form-control py-8"
					onSubmit={handleSubmit(handleSignUp)}
				>
					<input
						type="text"
						className="input input-sm input-bordered mb-4"
						placeholder="Email"
						{...register('email', { required: true })}
					/>

					<input
						type="text"
						className="input input-sm input-bordered mb-4"
						placeholder="Password"
						{...register('password', { required: true })}
					/>

					<input
						type="text"
						className="input input-sm input-bordered mb-4"
						placeholder="First Name"
						{...register('firstname', { required: true })}
					/>

					<input
						type="text"
						className="input input-sm input-bordered mb-4"
						placeholder="Last Name"
						{...register('lastname', { required: true })}
					/>

					<button className="btn btn-primary btn-sm" type="submit">
						Submit
					</button>
				</form>
			)}
		</div>
	);
}

export default SignUpForm;
