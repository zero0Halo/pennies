import { redirect } from 'next/navigation';
import SignUpForm from './SignUpForm';
import { useIsLoggedIn } from '@/app/hooks/server';

export default function SignUp() {
	const isLoggedIn = useIsLoggedIn();

	if (isLoggedIn) {
		redirect('/');
	}

	return (
		<div className="w-1/2 mx-auto">
			<h2>Signup</h2>
			<SignUpForm />
		</div>
	);
}
