// src/app/api/accounts/create/route.ts
// Also handles account updates. Refer to next config file.
import partials from '@/app/api/partials';
import { cookieJar, responseFactory, upsertIsGood } from '@/utils/api';
import type { AccountData } from '@/app/types';
import { ACCOUNTS } from '@/app/constants';

export async function POST(req: Request) {
	const payload = await req.json();
	const payloadArr = [payload];

	const { accountsSelect, accountsUpsert } = partials({
		user_uid: payload.user_uid,
	});

	// Get the default account if it exists
	const { data, error: defaultAccountError } =
		await accountsSelect('is_default');
	if (defaultAccountError) return defaultAccountError;

	const defaultAccount = data as AccountData[];

	// If there is a default account and the account being inserted is a default account, update the
	// existing account to no longer be the default
	if (defaultAccount.length && payload.is_default) {
		const noLongerDefault = { ...defaultAccount[0], is_default: false };
		payloadArr.push(noLongerDefault);
	}

	// Upsert the account data into the accounts table
	const { data: upsertData, error: upsertError } =
		await accountsUpsert(payloadArr);
	if (upsertError) return upsertError;

	// Check to make sure the upsert is good
	const { error: upsertMal } = await upsertIsGood({
		data: upsertData,
		original: payload,
	});
	if (upsertMal) return upsertMal;

	// Get all of the accounts
	const { data: accountsCookie, error: accountsCookieError } =
		await accountsSelect();
	if (accountsCookieError) return accountsCookieError;

	// Create a response and put the updated accounts data into the accounts cookie
	const response = responseFactory('Account Created!', {}, 200);
	response.cookies.set(...cookieJar({ name: ACCOUNTS, data: accountsCookie }));

	return response;
}
