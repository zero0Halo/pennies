import useServerCookie from './useServerCookie';
import { ACCOUNTS } from '@/app/constants';
import type { AccountData } from '@/app/types';

type UseAccountsReturnData = {
	accounts: AccountData[] | undefined | boolean;
	defaultAccount: AccountData | undefined;
	getAccountByName: ((arg: string) => AccountData | undefined) | undefined;
	getAccountByUid: ((arg: string) => AccountData | undefined) | undefined;
	noAccounts: boolean;
	options: { name: string; value: string }[] | undefined;
};

export default function useAccountsCookie(): UseAccountsReturnData {
	const [accounts] = useServerCookie<AccountData[]>(ACCOUNTS);
	const payload: UseAccountsReturnData = {
		accounts,
		defaultAccount: undefined,
		getAccountByName: undefined,
		getAccountByUid: undefined,
		noAccounts: true,
		options: undefined,
	};

	if (Array.isArray(accounts) && accounts.length) {
		payload.defaultAccount = accounts.find(({ is_default }) => is_default);

		payload.getAccountByName = (name: string): AccountData | undefined =>
			accounts.find((account) => account.name === name);

		payload.getAccountByUid = (uid: string): AccountData | undefined =>
			accounts.find((account) => account.uid === uid);

		payload.noAccounts = false;

		payload.options = accounts.map((account) => ({
			name: account.name,
			value: account.uid,
		}));
	}

	return payload;
}
