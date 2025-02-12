'use client';

import { USER } from '@/app/constants';
import useClientCookie from '@/app/hooks/client/useClientCookie';
import type { UserCookieData, UserData } from '@/app/types';
import { useEffect, useState } from 'react';

export default function useUserCookie(): UserCookieData {
	// CUSTOM HOOKS
	const { data: userData, error: userDataError } =
		useClientCookie<UserData>(USER);

	// STATE
	const [user, setUser] = useState<UserData | null>(null);
	const [categories, setCategories] = useState<string[] | null>(null);
	const [userError, setUserError] = useState<string | null>(null);

	if (userDataError) console.error(userDataError);

	// EFFECTS
	useEffect(() => {
		if (userData !== null && user === null) {
			setUser(userData);
			setCategories(userData.categories);
		}

		if (userDataError !== null && userError === null) {
			setUserError(userDataError);
		}
	}, [user, userData, userDataError, userError]);

	return { categories, user, userError };
}
