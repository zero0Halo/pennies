import { cookies } from 'next/headers';

export default function useServerCookie<T>(
	name: string,
): [T | boolean | null, boolean] {
	const cookieStore = cookies();
	const cookieData = cookieStore.get(name)?.value;
	let cookieValue: T | boolean | null;

	if (cookieData) {
		try {
			cookieValue = JSON.parse(cookieData) as T;
		} catch {
			console.error(`Couldn\'t parse cookie: "${name}"`);
			cookieValue = null;
		}
	} else {
		cookieValue = null;
	}

	const cookieDataValid =
		cookieValue !== null && typeof cookieValue !== 'boolean';

	return [cookieValue, cookieDataValid];
}
