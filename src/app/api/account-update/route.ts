// src/app/api/account-create/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@/utils/supabase/server';
import responseFactory from '../utils/responseFactory';
import { ACCOUNTS } from '@/app/constants';

export async function POST(req: Request) {
	try {
		const cookieStore = cookies();
		const supabase = createServerClient(cookieStore);
		const { is_default, name, type, uid, user_uid } = await req.json();

		// Get all of the accounts
		const { data: accountsSelectData, error: accountsSelectError } =
			await supabase.from(ACCOUNTS).select('*').eq('user_uid', user_uid);

		if (accountsSelectError)
			return responseFactory(
				'Error Retrieving Accounts Data',
				accountsSelectError,
			);

		console.log('1. ', { accountsSelectData });

		// Find out if there is a default account
		const defaultAccount = accountsSelectData
			? accountsSelectData.find((f) => f.is_default)
			: false;

		// If there is a default account and the account being updated is a default account, update the
		// existing account to no longer be the default
		if (defaultAccount && is_default) {
			const { error: accountUpdateError } = await supabase
				.from(ACCOUNTS)
				.update({ is_default: false })
				.eq('uid', defaultAccount.uid)
				.eq('user_uid', user_uid);

			if (accountUpdateError)
				return responseFactory(
					'Error Updating Original Default Account',
					accountUpdateError,
				);

			console.log('1a. ', { defaultAccount, is_default });
		}

		// Update the account's data
		const { data: accountData, error: accountInsertError } = await supabase
			.from(ACCOUNTS)
			.update({
				is_default,
				name,
				type,
			})
			.eq('uid', uid)
			.eq('user_uid', user_uid);

		console.log('2. ', { accountData });

		if (accountInsertError)
			return responseFactory('Error Inserting Account', accountInsertError);

		// Get all of the accounts
		const { data: accountsCookieData, error: accountsCookieError } =
			await supabase.from(ACCOUNTS).select('*').eq('user_uid', user_uid);

		if (accountsCookieError)
			return responseFactory(
				'Error Retrieving Accounts Data',
				accountsCookieError,
			);

		console.log('3. ', { accountsCookieData });

		// Create a response and put the updated accounts data into the accounts cookie
		const response = NextResponse.json(
			{
				message: 'Account Created',
				data: accountData,
			},
			{ status: 200 },
		);

		response.cookies.set(ACCOUNTS, JSON.stringify(accountsCookieData), {
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
