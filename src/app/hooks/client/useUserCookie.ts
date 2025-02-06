'use client';

import useClientCookie from '@/app/hooks/client/useClientCookie';
import { USER } from '@/app/constants';
import type { UserData } from '../../types';
import { useEffect, useState } from 'react';

export default function useUserCookie(): {
	user: UserData | null;
	userError: string | null;
} {
	// CUSTOM HOOKS
	const { data: userData, error: userDataError } =
		useClientCookie<UserData>(USER);

	// STATE
	const [user, setUser] = useState<UserData | null>(null);
	const [userError, setUserError] = useState<string | null>(null);

	if (userDataError) console.error(userDataError);

	// EFFECTS
	useEffect(() => {
		if (userData !== null && user === null) {
			setUser(userData);
		}

		if (userDataError !== null && userError === null) {
			setUserError(userDataError);
		}
	}, [user, userData, userDataError, userError]);

	return { user, userError };
}
