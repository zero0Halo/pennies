// src/app/api/signup/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
// import { Database } from '@/types/supabase'; // Assuming you have types defined for your Supabase schema

// Supabase environment variables (set these in your .env.local file)
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(req: Request) {
	try {
		const { email, password } = await req.json();

		// Create a Supabase client instance for the server-side
		const cookieStore = cookies();
		const supabase = createClient(cookieStore);

		// Create a new user using Supabase Auth
		const { data: authData, error: authError } = await supabase.auth.signUp({
			email,
			password,
		});

		if (authError) {
			return NextResponse.json({ message: authError.message }, { status: 400 });
		}

		// Insert additional user info into your custom users table
		const { data: userData, error: userError } = await supabase
			.from('users')
			.insert({
				uid: authData.user?.id,
				email: authData.user?.email,
				created_at: new Date(),
			});

		if (userError) {
			return NextResponse.json({ message: userError.message }, { status: 400 });
		}

		return NextResponse.json(
			{ message: 'User created successfully', user: userData },
			{ status: 201 },
		);
	} catch (error: unknown) {
		const errorMessage =
			error instanceof Error ? error.message : 'Unknown error';
		return NextResponse.json(
			{ message: 'Server error', error: errorMessage },
			{ status: 500 },
		);
	}
}
