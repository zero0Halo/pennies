import useServerCookie from '../server/useServerCookie';
import { ACCOUNTS } from '@/app/constants';
import type { AccountData } from '@/app/types';

type UseAccountsCookieData = {
	accounts: AccountData[] | null | boolean;
	defaultAccount: AccountData | null;
	getAccountByName: ((arg: string) => AccountData | null) | null;
	getAccountByUid: ((arg: string) => AccountData | null) | null;
	noAccounts: boolean;
	options: { name: string; value: string }[] | null;
};

export default function useAccountsCookie(): UseAccountsCookieData {
	const [accounts] = useServerCookie<AccountData[]>(ACCOUNTS);

	const payload: UseAccountsCookieData = {
		accounts: accounts ?? null,
		defaultAccount: null,
		getAccountByName: null,
		getAccountByUid: null,
		noAccounts: true,
		options: null,
	};

	// if (typeof accounts !== 'object') return payload;

	if (Array.isArray(accounts) && accounts.length) {
		payload.defaultAccount =
			accounts.find(({ is_default }) => is_default) ?? null;

		payload.getAccountByName = (name: string): AccountData | null =>
			accounts.find((account) => account.name === name) ?? null;

		payload.getAccountByUid = (uid: string): AccountData | null =>
			accounts.find((account) => account.uid === uid) ?? null;

		payload.noAccounts = false;

		payload.options = accounts.map((account) => ({
			name: account.name,
			value: account.uid,
		}));
	}

	return payload;
}
