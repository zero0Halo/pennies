'use client';

import useClientCookie from '@/app/hooks/client/useClientCookie';
import { ACCOUNTS } from '@/app/constants';
import type { AccountData } from '@/app/types';
import { useEffect, useState } from 'react';

interface UseAccountsCookieData {
	accounts: AccountData[];
	defaultAccount: AccountData | null;
	getAccountByName: (arg: string) => AccountData | null;
	getAccountByUid: (arg: string) => AccountData | null;
	noAccounts: boolean;
	options: { name: string; value: string }[];
}

export default function useAccountsCookie(): UseAccountsCookieData {
	// CUSTOM HOOKS
	const { data: accountsData, error: accountsDataError } =
		useClientCookie<AccountData[]>(ACCOUNTS);

	// STATE
	const [accounts, setAccounts] = useState<AccountData[]>([]);
	const [defaultAccount, setDefaultAccount] = useState<AccountData | null>(
		null,
	);
	const [options, setOptions] = useState<{ name: string; value: string }[]>([
		{ name: '', value: '' },
	]);

	if (accountsDataError) console.error(accountsDataError);

	// EFFECTS
	useEffect(() => {
		if (Array.isArray(accountsData)) {
			setAccounts(accountsData);
			setDefaultAccount(
				accountsData.find((account) => account.is_default === true) ?? null,
			);
			setOptions(
				accountsData.map((account) => ({
					name: account.name,
					value: account.uid,
				})),
			);
		}
	}, [accountsData]);

	// FUNCTIONS
	const getAccountByName = (name: string) =>
		accounts.find((account) => account.name === name) ?? null;
	const getAccountByUid = (uid: string) =>
		accounts.find((account) => account.uid === uid) ?? null;

	return {
		accounts,
		defaultAccount,
		getAccountByName,
		getAccountByUid,
		noAccounts: accounts.length === 0,
		options,
	};
}
