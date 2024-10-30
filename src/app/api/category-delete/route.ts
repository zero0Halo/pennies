// src/app/api/category-delete/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@/utils/supabase/server';
import responseFactory from '../utils/responseFactory';
import { USER, USERS } from '@/app/constants';

export async function POST(req: Request) {
	try {
		const cookieStore = cookies();
		const supabase = createServerClient(cookieStore);
		const { category, uid } = await req.json();

		// Get the categories from the Users table
		const { data: userData, error: userDataError } = await supabase
			.from(USERS)
			.select('categories')
			.eq('uid', uid)
			.single();

		if (userDataError)
			return responseFactory('Error Retrieving Categories', userDataError);

		// Remove the category from the array of categories
		const categories = Array.isArray(userData.categories)
			? userData.categories.filter((f) => f !== category)
			: false;

		if (categories === false)
			return responseFactory(`Category "${category}" Does Not Exist`);

		// Update the categories minus the one removed
		const { error: userUpdateError } = await supabase
			.from(USERS)
			.update({ categories })
			.eq('uid', uid);

		if (userUpdateError)
			return responseFactory('Error Removing Category', userUpdateError);

		// Get the user's data
		const { data: userCookieData, error: userCookieError } = await supabase
			.from(USERS)
			.select('*')
			.eq('uid', uid)
			.single();

		if (userCookieError)
			return responseFactory("Error Retrieving User's Data", userCookieError);

		// Create a response and put the updated accounts data into the accounts cookie
		const response = responseFactory('Successfully Deleted Category!', {}, 200);

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
