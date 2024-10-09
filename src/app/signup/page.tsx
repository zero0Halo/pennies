import { redirect } from 'next/navigation';
import useIsLoggedIn from '../hooks/useIsLoggedIn';
import SignUpForm from '../components/SignUpForm';

export default function SignUp() {
	const isLoggedIn = useIsLoggedIn();

	if (isLoggedIn) {
		redirect('/');
	}

	return <SignUpForm />;
}
