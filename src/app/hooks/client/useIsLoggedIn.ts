import { IS_LOGGED_IN } from '@/app/constants';
import useClientCookie from './useClientCookie';
import { useEffect, useState } from 'react';

export default function useIsLoggedIn() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
		const _isLoggedIn = useClientCookie<boolean | undefined>(IS_LOGGED_IN);

		setIsLoggedIn(!(_isLoggedIn !== undefined && _isLoggedIn));
	}, []);

	return isLoggedIn;
}
