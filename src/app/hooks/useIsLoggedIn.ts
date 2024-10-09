import { cookies } from 'next/headers';

export default function useIsLoggedIn() {
	const cookieStore = cookies();
	const isLoggedIn = cookieStore.get('isLoggedIn')?.value ?? false;

	return isLoggedIn === 'true';
}
