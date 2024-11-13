// src/app/api/category/create/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@/utils/supabase/server';
import { responseFactory } from '@/app/api/utils';
import { USER, USERS } from '@/app/constants';

export async function POST(req: Request) {
	try {
		const cookieStore = cookies();
		const supabase = createServerClient(cookieStore);
		const { categories, uid } = await req.json();

		const { error: userUpdateError } = await supabase
			.from(USERS)
			.update({
				categories: categories.sort((a: string, b: string) =>
					a.toLowerCase().localeCompare(b.toLowerCase()),
				),
			})
			.eq('uid', uid);

		if (userUpdateError)
			return responseFactory('Error Updating Categories', userUpdateError);

		// Get the user's data
		const { data: userCookieData, error: userCookieError } = await supabase
			.from(USERS)
			.select('*')
			.eq('uid', uid)
			.single();

		if (userCookieError)
			return responseFactory("Error Retrieving User's Data", userCookieError);

		// Create a response and put the updated accounts data into the accounts cookie
		const response = responseFactory('Successfully added category!', {}, 200);

		response.cookies.set(USER, JSON.stringify(userCookieData), {
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
