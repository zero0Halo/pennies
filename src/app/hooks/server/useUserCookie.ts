import { USER } from '@/app/constants';
import useServerCookie from './useServerCookie';
import type { UserData } from '@/app/types';

export default function useUserCookie(): {
	categories: string[] | null;
	userData: UserData | null;
} {
	const [userCookie] = useServerCookie<UserData | undefined>(USER);
	let categories = null;
	let userData = null;

	if (userCookie) {
		categories = userCookie.categories;
		userData = userCookie;
	}

	return { categories, userData };
}
