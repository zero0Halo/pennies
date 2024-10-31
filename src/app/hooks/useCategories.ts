'use client';

import useClientCookie from '@/app/hooks/useClientCookie';
import { defaultCategories, USER } from '@/app/constants';
import type { UserData } from '../types';

export default function useCategories() {
	const [userCookieData] = useClientCookie(USER);
	const userData = userCookieData as UserData;
	const customCategories =
		userData && userData !== null && Array.isArray(userData.categories)
			? userData.categories
			: [];
	const categories = [...defaultCategories, ...customCategories].sort(
		(a: string, b: string) => a.toLowerCase().localeCompare(b.toLowerCase()),
	);

	return { categories, customCategories, defaultCategories };
}
