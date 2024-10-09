import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import SignUpForm from '../components/SignUpForm';

export default function SignUp() {
	const cookieStore = cookies();
	const isLoggedIn = cookieStore.get('isLoggedIn')?.value ?? false;

	if (isLoggedIn === 'true') {
		redirect('/');
	}

	return <SignUpForm />;
}
