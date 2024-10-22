// src/app/api/account-create/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { ACCOUNTS, USER, USERS } from '@/app/constants';

function responseFactory(
	message: string,
	data?: object | null | undefined,
	status?: number | undefined,
) {
	return NextResponse.json({ message, data }, { status: status ?? 400 });
}

export async function POST(req: Request) {
	try {
		const cookieStore = cookies();
		const supabase = createClient(cookieStore);
		const { is_default, name, type, uid, user_uid } = await req.json();

		// Get the user's accounts. If there is an error or the account already exists, stop.
		const { data: userAccountsData, error: userSelectError } = await supabase
			.from(USERS)
			.select(ACCOUNTS)
			.eq('uid', user_uid)
			.single();

		if (userSelectError)
			return responseFactory('Error Getting User Accounts', userSelectError);

		if (
			Array.isArray(userAccountsData) &&
			userAccountsData.accounts.includes(uid)
		)
			return responseFactory('Account already exists for user');

		// Insert the account data into the accounts table. If there is an error, stop.
		const { error: accountInsertError } = await supabase.from(ACCOUNTS).insert({
			is_default,
			name,
			type,
			uid,
			user_uid,
		});

		if (accountInsertError)
			return responseFactory('Error Inserting Account', accountInsertError);

		// Add the new account uid to the existing array of accounts, or create a new array with that uid
		const updatedAccounts = Array.isArray(userAccountsData)
			? [...userAccountsData.accounts, uid]
			: [uid];

		// Update the user in the users table with the new accounts array. If there is an error, stop.
		const { data: userUpdateData, error: userUpdateError } = await supabase
			.from(USERS)
			.update({
				accounts: updatedAccounts,
			})
			.eq('uid', user_uid);

		if (userUpdateError)
			return responseFactory('Error Updating User Accounts', userUpdateError);

		// Create a response and set the 'isLoggedIn' cookie
		const response = NextResponse.json(
			{
				message: 'Update Successful',
				data: userUpdateData,
			},
			{ status: 200 },
		);

		response.cookies.set(USER, JSON.stringify(userUpdateData), {
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
