import Cookie from 'js-cookie';
import { useEffect, useState } from 'react';

export default function useClientCookie<T>(name: string): {
	data: T | null;
	error: string | null;
} {
	const [result, setResult] = useState<{
		data: T | null;
		error: string | null;
	}>({
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
