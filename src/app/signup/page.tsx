import { redirect } from 'next/navigation';
import useIsLoggedIn from '../hooks/useIsLoggedIn';
import SignUpForm from './SignUpForm';

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
