import { IS_LOGGED_IN } from '@/app/constants';
import useServerCookie from './useServerCookie';

export default function useIsLoggedIn() {
	const [isLoggedIn] = useServerCookie(IS_LOGGED_IN);

	return isLoggedIn === true;
}
