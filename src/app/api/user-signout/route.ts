// src/app/api/user-signout/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

export async function POST() {
	const cookieStore = cookies();
	const supabase = createClient(cookieStore);

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
	response.cookies.set('isLoggedIn', '', { maxAge: -1 });

	return response;
}
