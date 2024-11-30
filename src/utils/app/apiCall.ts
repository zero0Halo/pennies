interface SettingsData {
	onError: (arg: string) => void;
	onSuccess: (arg: string) => void;
	payload: object;
	reload?: string;
}

export default async function apiCall(
	endpoint: string,
	settings: SettingsData,
) {
	try {
		const response = await fetch(endpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(settings.payload),
		});

		const body = await response.json();
		console.log({ body });
		let msg: string[] | string = [body.message];

		if (body?.data?.message) msg.push(body?.data?.message);

		msg = msg.join(': ');

		if (response.ok) {
			settings.onSuccess(msg);

			if (settings?.reload) {
				setTimeout(() => {
					window.location.href = settings.reload as string;
				}, 2000);
			}

			return new Promise((resolve) => resolve(msg));
		}
		settings.onError(msg);
		return new Promise((_, reject) => reject(msg));
	} catch (err) {
		console.error(err);
		return new Promise((_, reject) => reject('Fuckin didnt work'));
	}
}
