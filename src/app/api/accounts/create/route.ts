// src/app/api/accounts/create/route.ts
// Also handles account updates. Refer to next config file.
import type { NextResponse } from 'next/server';
import { cookieJar } from '@/utils/api';
import type { AccountData, UserData } from '@/app/types';
import { ACCOUNTS, USER, USERS } from '@/app/constants';
import superiorBaseFactory from '@/utils/superiorBaseFactory';

export async function POST(req: Request) {
	const payload = await req.json();
	const payloadArr = [payload];

	const superiorBase = await superiorBaseFactory();
	const { data: defaultAccount, error: defaultAccountError } =
		await superiorBase
			.from(ACCOUNTS)
			.select('*')
			.eq('is_default', true)
			.single()
			.go<AccountData>();
	if (defaultAccountError) return defaultAccountError;

	// If there is a default account and the account being inserted is a default account, update the
	// existing account to no longer be the default
	if (defaultAccount !== null && payload.is_default) {
		const noLongerDefault = { ...defaultAccount, is_default: false };
		payloadArr.push(noLongerDefault);
	}

	// Upsert the account data into the accounts table
	const { error: upsertError } = await superiorBase
		.from(ACCOUNTS)
		.upsert(payloadArr)
		.go<AccountData[]>();
	if (upsertError) return upsertError;

	// Get all of the accounts
	const { data: accountsData, error: accountsDataError } = await superiorBase
		.from(ACCOUNTS)
		.select('*')
		.go<AccountData>();
	if (accountsDataError) return accountsDataError;

	// Update the user record with the new account data
	const {
		data: userData,
		success: response,
		error: userDataError,
	} = await superiorBase
		.from(USERS)
		.update({
			accounts: Array.isArray(accountsData)
				? accountsData.map((accountData) => accountData?.uid)
				: [],
		})
		.successMessage(`Account "${payload?.name}" Added!`)
		.single()
		.go<UserData>();
	if (userDataError || response === null) return userDataError;

	// Update the accounts & user cookies with the new data
	response.cookies.set(...cookieJar({ name: ACCOUNTS, data: accountsData }));
	response.cookies.set(...cookieJar({ name: USER, data: userData }));

	return response;
}
