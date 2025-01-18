import { IS_LOGGED_IN } from '@/app/constants';
import useServerCookie from './useServerCookie';

export default function useIsLoggedIn() {
	const [isLoggedInCookie] = useServerCookie<{ isLoggedIn: boolean }>(
		IS_LOGGED_IN,
	);

	return isLoggedInCookie && isLoggedInCookie.isLoggedIn === true;
}
