import type { SettingsData } from '@/app/types';

export default async function apiCall<T = null>(
	endpoint: string,
	settings: SettingsData,
): Promise<{ data: T | null; error: boolean; message: string }> {
	try {
		const isServer = typeof window === 'undefined';
		let path = endpoint;
		const headers: Record<string, string> = {
			'Content-Type': 'application/json', // Default headers
		};

		if (isServer) {
			// Dynamically import next/headers only in server context
			const { headers: nextHeaders } = await import('next/headers');
			const currentHeaders = nextHeaders();
			const host = currentHeaders.get('host');
			path = `http://${host}${endpoint}`;

			// Forward all headers from the original server request
			for (const [key, value] of currentHeaders.entries()) {
				headers[key] = value;
			}
		}

		const response = await fetch(path, {
			method: 'POST',
			headers,
			body: JSON.stringify(settings.payload),
		});
		const body = await response.json();

		// Handle response and invoke settings callbacks
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
			return { data: null, error: true, message: msg };
		}

		return body;
	} catch (err) {
		console.error('Error during API call:', err);
		return new Promise((_, reject) => reject('Error occurred during API call'));
	}
}
