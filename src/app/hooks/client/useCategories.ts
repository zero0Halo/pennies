'use client';

import useClientCookie from '@/app/hooks/client/useClientCookie';
import { defaultCategories, USER } from '@/app/constants';
import type { UserData } from '../../types';

interface UseCategoriesData {
	categories: string[];
	customCategories: string[];
	defaultCategories: string[];
}

export default function useCategories(): UseCategoriesData {
	const { data: userData, error: userDataError } =
		useClientCookie<UserData>(USER);

	if (userDataError) {
		console.error(userDataError);
		return {
			categories: [],
			customCategories: [],
			defaultCategories: [],
		};
	}

	const customCategories =
		userData && userData !== null && Array.isArray(userData.categories)
			? userData.categories
			: [];
	const categories = [...defaultCategories, ...customCategories].sort(
		(a: string, b: string) => a.toLowerCase().localeCompare(b.toLowerCase()),
	);

	return { categories, customCategories, defaultCategories };
}
