'use client';

import useClientCookie from '@/app/hooks/useClientCookie';
import { ACCOUNTS } from '@/app/constants';
import type { AccountData } from '@/app/types';

export default function useAccounts() {
	const [accountsData] = useClientCookie<AccountData[] | undefined | boolean>(
		ACCOUNTS,
	);
	const accounts = Array.isArray(accountsData)
		? (accountsData as AccountData[])
		: [];
	const defaultAccount = accounts.find(
		(account) => account.is_default === true,
	);
	const getAccountByName = (name: string) =>
		accounts.find((account) => account.name === name);
	const getAccountByUid = (uid: string) =>
		accounts.find((account) => account.uid === uid);

	return { accounts, defaultAccount, getAccountByName, getAccountByUid };
}
