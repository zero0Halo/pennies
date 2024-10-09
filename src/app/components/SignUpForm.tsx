'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface SignUp {
	email: string;
	firstname?: string;
	lastname?: string;
	password: string;
}

function SignUpForm() {
	const router = useRouter();
	const [success, setSuccess] = useState('');
	const [error, setError] = useState('');
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignUp>();

	const handleSignUp = async (formData: SignUp) => {
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
				router.push('/');
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
				<form onSubmit={handleSubmit(handleSignUp)}>
					<label htmlFor="email">eMail</label>
					<input
						type="text"
						className="mr-8 p-2"
						placeholder="email"
						{...register('email', { required: true })}
					/>
					<br />

					<label htmlFor="password">Password</label>
					<input
						type="text"
						className="mr-8 p-2"
						placeholder="Password"
						{...register('password', { required: true })}
					/>
					<br />

					<label htmlFor="firstname">Firstname</label>
					<input
						type="text"
						className="mr-8 p-2"
						placeholder="firstname"
						{...register('firstname', { required: true })}
					/>
					<br />

					<label htmlFor="lastname">Lastname</label>
					<input
						type="text"
						className="mr-8 p-2"
						placeholder="lastname"
						{...register('lastname', { required: true })}
					/>
					<br />

					<button type="submit">Submit</button>
				</form>
			)}
		</div>
	);
}

export default SignUpForm;
