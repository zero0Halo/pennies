// src/app/api/account-create/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

async function errorFactory(errorData: object | null, errorMessage: string) {
	if (errorData) {
		console.error({ errorData, errorMessage });

		const response = NextResponse.json(
			{ message: errorMessage, data: errorData },
			{ status: 400 },
		);

		return response;
	}
	return null;
}

export async function POST(req: Request) {
	try {
		const cookieStore = cookies();
		const supabase = createClient(cookieStore);
		const { is_default, name, type, uid, user_uid } = await req.json();

		const { error: accountInsertError } = await supabase
			.from('accounts')
			.insert({
				is_default,
				name,
				type,
				uid,
				user_uid,
			});

		let errorResponse = await errorFactory(
			accountInsertError,
			'Error Inserting Account',
		);

		if (errorResponse) return errorResponse;

		const { data: userAccountsData, error: userSelectError } = await supabase
			.from('users')
			.select('accounts')
			.eq('uid', user_uid)
			.single();

		errorResponse = await errorFactory(
			userSelectError,
			'Error Getting User Accounts',
		);
		if (errorResponse) return errorResponse;

		const updatedAccounts = Array.isArray(userAccountsData)
			? [...userAccountsData.accounts, uid]
			: [uid];

		const { data: userUpdateData, error: userUpdateError } = await supabase
			.from('users')
			.update({
				accounts: updatedAccounts,
			})
			.eq('uid', user_uid);

		errorResponse = await errorFactory(
			userUpdateError,
			'Error Updating User Accounts',
		);
		if (errorResponse) return errorResponse;

		// Create a response and set the 'isLoggedIn' cookie
		const response = NextResponse.json(
			{
				message: 'Update Successful',
				data: userUpdateData,
			},
			{ status: 200 },
		);

		response.cookies.set('user', JSON.stringify(userUpdateData), {
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
