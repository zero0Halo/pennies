import { createServerClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import useServerCookie from '../hooks/useServerCookie';
import { ACCOUNTS, USER } from '@/app/constants';
import type { UserData } from '@/app/types';
import Accounts from './components/Accounts';
import { redirect } from 'next/navigation';

async function getAccountsData(userData: UserData) {
	try {
		if (!userData.uid) throw new Error("User's UID not found");

		const cookieStore = cookies();
		const supabase = createServerClient(cookieStore);
		const { data: userAccountsData, error: userAccountsError } = await supabase
			.from(ACCOUNTS)
			.select('*')
			.eq('user_uid', userData.uid)
			.order('is_default', { ascending: false });

		if (userAccountsError) throw new Error('Failed to fetch accounts');

		return userAccountsData ?? [];
	} catch (error) {
		console.error(error);
		return [];
	}
}

export default async function AccountsPage() {
	const [userCookieData] = useServerCookie<UserData>(USER);
	const accounts =
		typeof userCookieData === 'object'
			? await getAccountsData(userCookieData as UserData)
			: [];

	if (!userCookieData) {
		redirect('/');
	}

	return (
		<>
			<h1>Accounts</h1>

			<Accounts accountsData={accounts} />
		</>
	);
}
