// src/app/api/category/delete/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@/utils/supabase';
import { alphaSort, cookieJar, responseFactory } from '@/utils/api';
import { USER, USERS } from '@/app/constants';
import superiorBaseFactory from '@/utils/superiorBaseFactory';
import type { UserData } from '@/app/types';
import { responseError } from '@/utils/api/responseFactory';

export async function POST(req: Request) {
	try {
		const cookieStore = cookies();
		const supabase = createServerClient(cookieStore);
		const { category, uid } = await req.json();

		const superiorBase = await superiorBaseFactory();

		// Get the categories from the Users table
		const { data: userData, error: userDataError } = await superiorBase
			.from(USERS)
			.select('categories')
			.eq('uid', uid)
			.single()
			.go<UserData>();

		if (userDataError || userData === null) return userDataError;

		// Remove the category from the array of categories
		const categories: string[] | boolean = Array.isArray(userData.categories)
			? userData.categories.filter((f) => f !== category)
			: false;

		if (categories === false)
			return responseError({
				message: `Category "${category}" Does Not Exist`,
			});

		const sortedCategories = alphaSort(categories);

		// Update the categories minus the one removed
		const { error: userUpdateError } = await superiorBase
			.from(USERS)
			.update({
				categories: sortedCategories,
			})
			.eq('uid', uid)
			.go();

		if (userUpdateError) return userUpdateError;

		// Get the user's data
		const {
			data: userCookieData,
			error: userCookieError,
			success: response,
		} = await superiorBase
			.from(USERS)
			.select('*')
			.eq('uid', uid)
			.single()
			.successMessage('Successfully Deleted Category!')
			.go();

		if (userCookieError || response === null) return userCookieError;

		// Create a response and put the updated accounts data into the accounts cookie
		response.cookies.set(...cookieJar({ name: USER, data: userCookieData }));

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
