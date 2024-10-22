// src/app/api/signup/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
	try {
		const { email, firstname, lastname, password } = await req.json();

		// Create a Supabase client instance for the server-side
		const cookieStore = cookies();
		const supabase = createServerClient(cookieStore);

		// Create a new user using Supabase Auth
		const { data: authData, error: authError } = await supabase.auth.signUp({
			email,
			password,
		});

		if (authError) {
			return NextResponse.json({ message: authError.message }, { status: 400 });
		}

		// Insert additional user info into your custom users table
		const { error: userError } = await supabase.from('users').insert({
			created_at: new Date(),
			email: authData.user?.email,
			first_name: firstname,
			last_name: lastname,
			uid: authData.user?.id,
		});

		if (userError) {
			return NextResponse.json({ message: userError.message }, { status: 400 });
		}

		const response = NextResponse.json(
			{
				message: 'Signup Successful! Redirecting...',
			},
			{ status: 200 },
		);

		response.cookies.set('isLoggedIn', 'true', {
			httpOnly: true,
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
