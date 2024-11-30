// src/app/api/accounts/delete/route.ts
import { cookieJar } from '@/utils/api';
import { ACCOUNTS, USER, USERS } from '@/app/constants';
import type { AccountData, UserData } from '@/app/types';
import superiorBaseFactory from '@/utils/superiorBaseFactory';
import { responseError } from '@/utils/api/responseFactory';

export async function POST(req: Request) {
	const { account } = await req.json();
	const superiorBase = await superiorBaseFactory();

	// Get all of the accounts
	const { data: accountsData, error: accountsDataError } = await superiorBase
		.from(ACCOUNTS)
		.select('*')
		.go<AccountData>();
	if (accountsDataError || !Array.isArray(accountsData))
		return accountsDataError;

	// Find the default account
	const defaultAccount = Array.isArray(accountsData)
		? accountsData.find((account) => account.is_default)
		: false;
	if (defaultAccount === false)
		return responseError('No Default Account, which shouldnt be possible');

	// If the account being deleted is the default and there will be an account left when it's gone,
	// assign the first account as the new default
	if (
		defaultAccount?.uid === account.uid &&
		Array.isArray(accountsData) &&
		accountsData.length > 1
	) {
		const [accountNoDefault] = accountsData.filter(
			(account) => !account.is_default,
		);
		const { error: accountNewDefaultError } = await superiorBase
			.from(ACCOUNTS)
			.update(accountNoDefault)
			.go<AccountData>();
		if (accountNewDefaultError) return accountNewDefaultError;
	}

	// Delete the specified account.
	const { error: accountsDeleteError } = await superiorBase
		.from(ACCOUNTS)
		.delete()
		.eq('uid', account.uid)
		.go();
	if (accountsDeleteError) return accountsDeleteError;

	// Get all accounts
	const allAccounts = accountsData.filter(
		(accountData) => accountData.uid !== account.uid,
	);

	// Update user record
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
		.successMessage(`Account "${account.name}" Deleted`)
		.single()
		.go<UserData>();
	if (userDataError || response === null) return userDataError;

	// Set the accounts & user cookies with the updated data
	response.cookies.set(...cookieJar({ name: ACCOUNTS, data: allAccounts }));
	response.cookies.set(...cookieJar({ name: USER, data: userData }));

	return response;
}
