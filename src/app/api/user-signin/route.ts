// src/app/api/user-signin/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
	try {
		const cookieStore = cookies();
		const supabase = createClient(cookieStore);
		const { email, password } = await req.json();

		const { data: authData, error: authError } =
			await supabase.auth.signInWithPassword({
				email,
				password,
			});

		if (authError) {
			return NextResponse.json(
				{ message: 'Error Logging In', data: authError },
				{ status: 400 },
			);
		}

		// Create a response and set the 'isLoggedIn' cookie
		const response = NextResponse.json(
			{ message: 'Sign In Successful! Redirecting...', data: authData },
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
