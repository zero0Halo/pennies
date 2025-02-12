import { USER } from '@/app/constants';
import useServerCookie from '../server/useServerCookie';
import type { UserCookieData, UserData } from '@/app/types';

export default function useUserCookie(): UserCookieData {
	const [userCookie] = useServerCookie<UserData | undefined>(USER);
	let categories = null;
	let user = null;
	let userError = null;

	if (userCookie) {
		categories = userCookie.categories;
		user = userCookie;
	} else {
		userError = 'User cookie not found';
	}

	return { categories, user, userError };
}
