'use client';

import { IS_LOGGED_IN } from '@/app/constants';
import useClientCookie from './useClientCookie';
import { useEffect, useState } from 'react';

export default function useIsLoggedInCookie() {
	// STATE
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

	// CUSTOM HOOKS
	const _isLoggedIn = useClientCookie<boolean | undefined>(IS_LOGGED_IN);

	// EFFECTS
	useEffect(() => {
		setIsLoggedIn(!(_isLoggedIn !== undefined && _isLoggedIn));
	}, []);

	return isLoggedIn;
}
