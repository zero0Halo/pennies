// src/app/api/accounts/create/route.ts
// Also handles account updates. Refer to next config file.
import type { NextResponse } from 'next/server';
import { cookieJar } from '@/utils/api';
import type { AccountData } from '@/app/types';
import { ACCOUNTS } from '@/app/constants';
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
	const {
		data: accountsData,
		success: accountsSuccess,
		error: accountsDataError,
	} = await superiorBase
		.from(ACCOUNTS)
		.select('*')
		.successMessage(`Account "${payload?.name}" Added!`)
		.go<AccountData[]>();
	if (accountsDataError) return accountsDataError;

	(accountsSuccess as NextResponse).cookies.set(
		...cookieJar({ name: ACCOUNTS, data: accountsData }),
	);

	return accountsSuccess;
}
