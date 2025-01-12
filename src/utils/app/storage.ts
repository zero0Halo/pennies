'use client';

/*
  Used to access localStorage
*/

import { CSV_UPLOAD, MONTHLY_SUMS } from '@/app/constants';

interface SetArgs {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	data: any;
	keyName: string;
}

function get<T>({ keyName }: { keyName: string }): T | string | boolean {
	if (typeof localStorage === 'undefined') return false;

	const item = localStorage.getItem(keyName);

	if (item) {
		try {
			return JSON.parse(item);
		} catch {
			return item;
		}
	}
	return false;
}

function removeAll() {
	localStorage.removeItem(CSV_UPLOAD);
	localStorage.removeItem(MONTHLY_SUMS);
}

function set({ keyName, data }: SetArgs): boolean {
	if (typeof localStorage === 'undefined') return false;

	try {
		localStorage.setItem(
			keyName,
			typeof data === 'string' ? data : JSON.stringify(data),
		);

		return true;
	} catch (err) {
		console.warn(`Couldn\'t create localStorage entry, ${keyName}`);
		return false;
	}
}

const storage = {
	get,
	removeAll,
	set,
};

export default storage;
