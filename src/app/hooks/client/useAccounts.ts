'use client';

import useClientCookie from '@/app/hooks/client/useClientCookie';
import { ACCOUNTS } from '@/app/constants';
import type { AccountData } from '@/app/types';
import { useEffect, useState } from 'react';

interface UseAccountsReturn {
	accounts: AccountData[];
	defaultAccount: AccountData | undefined;
	getAccountByName: (arg: string) => AccountData | undefined;
	getAccountByUid: (arg: string) => AccountData | undefined;
	options: { name: string; value: string }[];
}

export default function useAccounts(): UseAccountsReturn {
	const { data: accountsData, error: accountsDataError } =
		useClientCookie<AccountData[]>(ACCOUNTS);
	const [accounts, setAccounts] = useState<AccountData[]>([]);
	const [defaultAccount, setDefaultAccount] = useState<AccountData>();
	const [options, setOptions] = useState<{ name: string; value: string }[]>([
		{ name: '', value: '' },
	]);

	if (accountsDataError) console.error(accountsDataError);

	useEffect(() => {
		if (Array.isArray(accountsData)) {
			setAccounts(accountsData);
			setDefaultAccount(
				accountsData.find((account) => account.is_default === true),
			);
			setOptions(
				accountsData.map((account) => ({
					name: account.name,
					value: account.uid,
				})),
			);
		}
	}, [accountsData]);

	const getAccountByName = (name: string) =>
		accounts.find((account) => account.name === name);
	const getAccountByUid = (uid: string) =>
		accounts.find((account) => account.uid === uid);

	return {
		accounts,
		defaultAccount,
		getAccountByName,
		getAccountByUid,
		options,
	};
}
