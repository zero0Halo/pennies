interface CookieJarArgs {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	data?: any;
	empty?: boolean;
	name?: string;
}

type CookieSettings = {
	maxAge?: number;
	secure?: boolean;
};

type CookieJarReturn = [string, string, CookieSettings];

export default function cookieJar({
	name,
	data,
	empty,
}: CookieJarArgs): CookieJarReturn {
	if (empty === true && name) return [name, '', { maxAge: -1 }];

	if (name && data)
		return [
			name,
			JSON.stringify(data),
			{
				maxAge: 60 * 60 * 24 * 7, // 1 week
				secure: process.env.NODE_ENV === 'production',
			},
		];

	return ['', '', {}];
}
