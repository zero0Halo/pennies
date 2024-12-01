interface SettingsData {
	onError?: (arg: string) => void;
	onSuccess?: (arg: string) => void;
	payload: object;
	reload?: string;
}

export default async function apiCall(
	endpoint: string,
	settings: SettingsData,
) {
	try {
		const isServer = typeof window === 'undefined';
		let path = endpoint;

		if (isServer) {
			const { headers } = await import('next/headers');
			const host = headers().get('host');
			path = `https://${host}/api/some-endpoint`;
		}

		const response = await fetch(endpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(settings.payload),
		});

		const body = await response.json();

		let msg: string[] | string = [body.message];

		if (body?.data?.message) msg.push(body?.data?.message);

		msg = msg.join(': ');

		if (response.ok) {
			settings?.onSuccess?.(msg);

			if (settings?.reload) {
				setTimeout(() => {
					window.location.href = settings.reload as string;
				}, 2000);
			}
		} else {
			settings?.onError?.(msg);
		}

		return body;
	} catch (err) {
		console.error(err);
		return new Promise((_, reject) => reject('Fuckin didnt work'));
	}
}
