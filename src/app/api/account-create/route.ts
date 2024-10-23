// src/app/api/account-create/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@/utils/supabase/server';
import responseFactory from '../utils/responseFactory';
import { ACCOUNTS } from '@/app/constants';
import useServerCookie from '@/app/hooks/useServerCookie';
import type { AccountData } from '@/app/types';

export async function POST(req: Request) {
	try {
		const cookieStore = cookies();
		const supabase = createServerClient(cookieStore);
		const { is_default, name, type, uid, user_uid } = await req.json();
		const [accountsCookieData] = useServerCookie<AccountData[]>(ACCOUNTS);
		let accountsForCookie: string;

		const { data: accountsSelectData, error: accountsSelectError } =
			await supabase.from(ACCOUNTS).select('*').eq('user_uid', user_uid);

		if (accountsSelectError)
			return responseFactory(
				'Error Retrieving Accounts Data',
				accountsSelectError,
			);

		const defaultAccount = accountsSelectData
			? accountsSelectData.find((f) => f.is_default)
			: false;

		if (defaultAccount) {
			const { error: accountUpdateError } = await supabase
				.from(ACCOUNTS)
				.update({ is_default: false })
				.eq('user_uid', user_uid);

			if (accountUpdateError)
				return responseFactory(
					'Error Updating Original Default Account',
					accountUpdateError,
				);
		}

		// Insert the account data into the accounts table. If there is an error, stop.
		const { data: accountData, error: accountInsertError } = await supabase
			.from(ACCOUNTS)
			.insert({
				is_default,
				name,
				type,
				uid,
				user_uid,
			});

		if (accountInsertError)
			return responseFactory('Error Inserting Account', accountInsertError);

		const response = NextResponse.json(
			{
				message: 'Account Created',
				data: accountData,
			},
			{ status: 200 },
		);

		if (!accountsCookieData) {
			accountsForCookie = JSON.stringify([accountData]);
		} else {
			accountsForCookie = JSON.stringify([
				...(accountsCookieData as AccountData[]),
				accountData,
			]);
		}

		response.cookies.set(ACCOUNTS, accountsForCookie, {
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 7, // 1 week
		});

		return response;
	} catch (error: unknown) {
		console.error(error);
		const errorMessage =
			error instanceof Error ? error.message : 'Unknown error';
		return NextResponse.json(
			{ message: 'Server error', error: errorMessage },
			{ status: 500 },
		);
	}
}
