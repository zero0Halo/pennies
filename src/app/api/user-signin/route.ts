// src/app/api/user-signin/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@/utils/supabase/server';
import { ACCOUNTS, IS_LOGGED_IN, USER, USERS } from '@/app/constants';
import responseFactory from '../utils/responseFactory';

export async function POST(req: Request) {
	try {
		const cookieStore = cookies();
		const supabase = createServerClient(cookieStore);
		const { email, password } = await req.json();

		const { data: authData, error: authError } =
			await supabase.auth.signInWithPassword({
				email,
				password,
			});

		if (authError)
			return responseFactory('Error Authorizing User Account', authError);

		const { data: userData, error: userError } = await supabase
			.from(USERS)
			.select('*')
			.eq('uid', authData.user.id)
			.single();

		if (userError)
			return responseFactory('Error Retrieving User Data', userError);

		const { data: accountsData, error: accountsError } = await supabase
			.from(ACCOUNTS)
			.select('*')
			.eq('user_uid', authData.user.id);

		if (accountsError)
			return responseFactory('Error Retrieving Accounts Data', accountsData);

		const response = NextResponse.json(
			{
				message: 'Sign In Successful! Redirecting...',
				data: { authData, userData },
			},
			{ status: 200 },
		);

		response.cookies.set(IS_LOGGED_IN, 'true', {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 7, // 1 week
		});
		response.cookies.set(USER, JSON.stringify(userData), {
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 7, // 1 week
		});
		response.cookies.set(ACCOUNTS, JSON.stringify(accountsData), {
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 7, // 1 week
		});

		return response;
	} catch (error: unknown) {
		const errorMessage =
			error instanceof Error ? error.message : 'Unknown error';
		return NextResponse.json(
			{ message: 'Server error', error: errorMessage },
			{ status: 500 },
		);
	}
}
