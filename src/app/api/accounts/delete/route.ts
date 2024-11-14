// src/app/api/accounts/delete/route.ts
import { cookieJar, responseFactory } from '@/utils/api';
import { ACCOUNTS } from '@/app/constants';
import partials from '../../partials';
import type { AccountData } from '@/app/types';

export async function POST(req: Request) {
	const { account, user_uid } = await req.json();
	const { accountsDelete, accountsSelect, accountsUpdate } = partials({
		user_uid,
	});

	// Get all the accounts
	const { data, error: accountsError } = await accountsSelect('*');
	if (accountsError) return accountsError;

	// Find the default account
	const accounts = data as AccountData[];
	const defaultAccount = accounts.find((account) => account.is_default);

	// If the account being deleted is the default and there will be an account left when it's gone,
	// assign the first account as the new default
	if (defaultAccount?.uid === account.uid && accounts.length > 1) {
		const [accountNoDefault] = accounts.filter(
			(account) => !account.is_default,
		);
		const { error: updateNewDefaultError } =
			await accountsUpdate(accountNoDefault);
		if (updateNewDefaultError) return updateNewDefaultError;
	}

	// Delete the specified account.
	const { error: accountsDeleteError } = await accountsDelete(account);
	if (accountsDeleteError) return accountsDeleteError;

	// Get all accounts
	const { data: allAccounts, error: allAccountsError } =
		await accountsSelect('*');
	if (allAccountsError) return allAccountsError;

	// All done. Create the final response.
	const response = responseFactory('Account Deleted Successfully!', {}, 200);

	// Set the accounts cookie with the updated listing of all accounts
	response.cookies.set(...cookieJar({ name: ACCOUNTS, data: allAccounts }));

	return response;
}
