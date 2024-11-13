// src/app/api/user/signout/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@/utils/supabase/server';
import { ACCOUNTS, IS_LOGGED_IN, MONTHLY_SUMS, USER } from '@/app/constants';
import { cookieJar } from '@/app/api/utils';

export async function POST() {
	const cookieStore = cookies();
	const supabase = createServerClient(cookieStore);

	const { error } = await supabase.auth.signOut();

	if (error) {
		return NextResponse.json({ message: 'Error Logging Out' }, { status: 400 });
	}

	// Create a response and clear the 'isLoggedIn' cookie
	const response = NextResponse.json(
		{ message: 'Logged Out Successfully' },
		{ status: 200 },
	);

	response.cookies.set(...cookieJar({ name: ACCOUNTS, empty: true }));
	response.cookies.set(...cookieJar({ name: IS_LOGGED_IN, empty: true }));
	response.cookies.set(...cookieJar({ name: MONTHLY_SUMS, empty: true }));
	response.cookies.set(...cookieJar({ name: USER, empty: true }));

	return response;
}
