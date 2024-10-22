import { cookies } from 'next/headers';

export default function useServerCookie<T>(
	name: string,
): [T | boolean | undefined, boolean] {
	const cookieStore = cookies();
	const cookieData = cookieStore.get(name)?.value;
	let cookieValue: T | boolean | undefined;

	if (cookieData) {
		try {
			cookieValue = JSON.parse(cookieData) as T;
		} catch {
			console.error(`Couldn\'t parse cookie: "${name}"`);
			cookieValue = false;
		}
	} else {
		cookieValue = false;
	}

	const cookieDataValid =
		cookieValue !== undefined && typeof cookieValue !== 'boolean';

	return [cookieValue, cookieDataValid];
}
