'use client';

import { useForm } from 'react-hook-form';
import { createClient } from '@/utils/supabase/client';

interface SignUp {
	email: string;
	password: string;
}

function SignUpForm() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignUp>();
	// const cookieStore = cookies();
	const supabase = createClient();
	const handleSignUp = async (formData: SignUp) => {
		const { data, error } = await supabase.auth.signUp({
			email: formData.email,
			password: formData.password,
		});

		if (!error) {
			console.log({ data });
		} else {
			console.log({ error });
		}
	};

	return (
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
	);
}

export default SignUpForm;
