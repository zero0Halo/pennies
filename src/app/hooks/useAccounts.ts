'use client';

import useClientCookie from '@/app/hooks/useClientCookie';
import { ACCOUNTS } from '@/app/constants';
import type { AccountData } from '@/app/types';
import { useEffect, useState } from 'react';

export default function useAccounts() {
	const [accountsData] = useClientCookie<AccountData[] | undefined | boolean>(
		ACCOUNTS,
	);
	const [accounts, setAccounts] = useState<AccountData[]>([]);
	const [defaultAccount, setDefaultAccount] = useState<AccountData>();
	const [options, setOptions] = useState<{ name: string; value: string }[]>([
		{ name: '', value: '' },
	]);

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
