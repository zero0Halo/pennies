// src/app/api/user-signout/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@/utils/supabase/server';
import { ACCOUNTS, IS_LOGGED_IN, USER } from '@/app/constants';

export async function POST() {
	const cookieStore = cookies();
	const supabase = createServerClient(cookieStore);

	const { error } = await supabase.auth.signOut();
	console.log(error);
	if (error) {
		return NextResponse.json({ message: 'Error Logging Out' }, { status: 400 });
	}

	// Create a response and clear the 'isLoggedIn' cookie
	const response = NextResponse.json(
		{ message: 'Logged Out Successfully' },
		{ status: 200 },
	);
	response.cookies.set(IS_LOGGED_IN, '', { maxAge: -1 });
	response.cookies.set(ACCOUNTS, '', { maxAge: -1 });
	response.cookies.set(USER, '', { maxAge: -1 });

	return response;
}
