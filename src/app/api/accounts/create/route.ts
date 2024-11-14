// src/app/api/accounts/create/route.ts
import { cookies } from 'next/headers';
import { createServerClient } from '@/utils/supabase';
import { cookieJar, responseFactory, upsertIsGood } from '@/utils/api';
import partials from '@/app/api/partials';
import type { AccountData } from '@/app/types';
import { ACCOUNTS } from '@/app/constants';

export async function POST(req: Request) {
	const cookieStore = cookies();
	const supabase = createServerClient(cookieStore);
	const { is_default, name, type, uid, user_uid } = await req.json();
	const payload = [
		{
			is_default,
			name,
			type,
			uid,
			user_uid,
		},
	];
	const { accountsSelect } = partials({ user_uid });

	// Get the default account if it exists
	const { data, error: defaultAccountError } =
		await accountsSelect('is_default');
	const defaultAccount = data as AccountData[];

	if (defaultAccountError) return defaultAccountError;

	// If there is a default account and the account being inserted is a default account, update the
	// existing account to no longer be the default
	if (defaultAccount.length && is_default) {
		const noLongerDefault = { ...defaultAccount[0], is_default: false };
		payload.push(noLongerDefault);
	}

	// Upsert the account data into the accounts table
	const { data: upsertData, error: upsertError } = await supabase
		.from(ACCOUNTS)
		.upsert(payload);
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
