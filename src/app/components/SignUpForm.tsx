'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface SignUp {
	email: string;
	password: string;
}

function SignUpForm() {
	const [success, setSuccess] = useState(false);
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
				password: formData.password,
			}),
		});

		const result = await response.json();

		if (response.ok) {
			setSuccess(true);
		} else {
			setError(result.message || 'Sign up failed');
		}
	};

	return (
		<div>
			{success && <h3>Success!</h3>}
			{error.length > 0 && <h3>{error}</h3>}

			<form onSubmit={handleSubmit(handleSignUp)}>
				<input
					type="text"
					className="mr-8 p-2"
					placeholder="email"
					{...register('email', { required: true })}
				/>
				<input
					type="text"
					className="mr-8 p-2"
					placeholder="Password"
					{...register('password', { required: true })}
				/>
				<button type="submit">Submit</button>
			</form>
		</div>
	);
}

export default SignUpForm;
