import Cookie from 'js-cookie';
import { useEffect, useState } from 'react';

export default function useClientCookie<T>(
	name: string,
): T | boolean | undefined {
	const [cookieValue, setCookieValue] = useState<T | boolean | undefined>(
		undefined,
	);

	useEffect(() => {
		const cookieData = Cookie.get(name);
		if (cookieData) {
			try {
				setCookieValue(JSON.parse(cookieData) as T);
			} catch {
				console.error(`Couldn\'t parse cookie: "${name}"`);
				setCookieValue(false);
			}
		} else {
			setCookieValue(false);
		}
	}, [name]);

	return cookieValue;
}
