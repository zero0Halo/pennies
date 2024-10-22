import { createServerClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import useServerCookie from '../hooks/useServerCookie';
import AccountCreate from '@/app/accounts/components/AccountCreate';
import { ACCOUNTS, USER } from '@/app/constants';
import type { UserData } from '@/app/types';
import AccountsTable from '@/app/accounts/components/AccountsTable';
import Accounts from './components/Accounts';

async function getAccountsData(userData: UserData) {
	try {
		if (!userData.uid) throw new Error("User's UID not found");

		const cookieStore = cookies();
		const supabase = createServerClient(cookieStore);
		const { data: userAccountsData, error: userAccountsError } = await supabase
			.from(ACCOUNTS)
			.select('*')
			.eq('user_uid', userData.uid);

		if (userAccountsError) throw new Error('Failed to fetch accounts');

		return userAccountsData ?? [];
	} catch (error) {
		console.error(error);
		return [];
	}
}

export default async function AccountsPage() {
	const [userData] = useServerCookie<UserData>(USER);
	const accounts =
		typeof userData === 'object'
			? await getAccountsData(userData as UserData)
			: [];

	return (
		<section className="container mx-auto pt-4">
			<h1>Accounts</h1>

			<Accounts accountsData={accounts} />
		</section>
	);
}
