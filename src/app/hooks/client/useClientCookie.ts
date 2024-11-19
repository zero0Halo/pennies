import Cookie from 'js-cookie';
import { useEffect, useState } from 'react';

interface UseClientCookieResult<T> {
	data: T | null;
	error: string | null;
}

export default function useClientCookie<T>(
	name: string,
): UseClientCookieResult<T> {
	const [result, setResult] = useState<UseClientCookieResult<T>>({
		data: null,
		error: null,
	});

	useEffect(() => {
		const cookieData = Cookie.get(name);
		if (!cookieData) {
			setResult({ data: null, error: `Cookie "${name}" not found` });
			return;
		}

		try {
			const parsedData = JSON.parse(cookieData) as T;
			setResult({ data: parsedData, error: null });
		} catch (e) {
			setResult({
				data: null,
				error: `Failed to parse cookie "${name}": ${(e as Error).message}`,
			});
		}
	}, [name]);

	return result;
}
