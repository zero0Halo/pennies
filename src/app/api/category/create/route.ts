// src/app/api/category/create/route.ts
import { NextResponse } from 'next/server';
import { cookieJar } from '@/utils/api';
import { USER, USERS } from '@/app/constants';
import superiorBaseFactory from '@/utils/superiorBaseFactory';

export async function POST(req: Request) {
	try {
		const { categories, uid } = await req.json();

		const superiorBase = await superiorBaseFactory();

		const { error: userUpdateError } = await superiorBase
			.from(USERS)
			.update({
				categories: categories.sort((a: string, b: string) =>
					a.toLowerCase().localeCompare(b.toLowerCase()),
				),
			})
			.eq('uid', uid)
			.go();

		if (userUpdateError) return userUpdateError;

		// Get the user's data
		const {
			data: userCookieData,
			error: userCookieError,
			success: response,
		} = await superiorBase.from(USERS).select('*').eq('uid', uid).single().go();

		if (userCookieError) return userCookieError;

		response?.cookies.set(...cookieJar({ name: USER, data: userCookieData }));

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
