interface SettingsData {
	onError?: (arg: string) => void;
	onSuccess?: (arg: string) => void;
	payload: object;
	reload?: string;
}

export default async function apiCall<T>(
	endpoint: string,
	settings: SettingsData,
): Promise<{ data: T | null; message: string | null }> {
	try {
		const path =
			typeof window !== 'undefined'
				? endpoint
				: `http://localhost:3000${endpoint}`;

		const response = await fetch(path, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(settings.payload),
		});
		const body = await response.json();
		const data = (body?.data as T) || null;
		const message =
			[body?.message, body?.data?.message].filter(Boolean).join(': ') || '';

		if (response.ok) {
			settings.onSuccess?.(message);

			if (settings.reload && window !== undefined) {
				setTimeout(() => {
					// biome-ignore lint/style/noNonNullAssertion: <explanation>
					window.location.href = settings.reload!;
				}, 2000);
			}

			return { data, message };
		}

		settings.onError?.(message);

		return { data, message };
	} catch (error) {
		const message = 'API Call Error';

		console.error(message, error);
		settings.onError?.(message);

		return { data: null, message };
	}
}
