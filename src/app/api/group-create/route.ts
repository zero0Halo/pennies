// src/app/api/account-create/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@/utils/supabase/server';
import responseFactory from '../utils/responseFactory';
import { GROUPS } from '@/app/constants';

export async function POST(req: Request) {
	try {
		const cookieStore = cookies();
		const supabase = createServerClient(cookieStore);
		const { group, transactions } = await req.json();
		const { user_uid } = group;

		// Get the prime values from groups table
		const { data: primeSelectData, error: primeSelectError } = await supabase
			.from(GROUPS)
			.select('prime')
			.eq('user_uid', user_uid);

		if (primeSelectError)
			return responseFactory(
				"Error Retrieving Group Prime's",
				primeSelectError,
			);

		if (primeSelectData.includes(group.prime))
			return responseFactory(
				'A Group With This Prime Already Exists',
				primeSelectData,
			);

		const { error: insertGroupError } = await supabase
			.from(GROUPS)
			.insert({ ...group });

		if (insertGroupError)
			return responseFactory('Error Creating Group', insertGroupError);

		// Get all of the grouops
		const { data: selectGroupsData, error: selectGroupsError } = await supabase
			.from(GROUPS)
			.select('*')
			.eq('user_uid', user_uid)
			.order('created', { ascending: false });

		if (selectGroupsError)
			return responseFactory('Error Retrieving Groups Data', selectGroupsError);

		const response = responseFactory(
			`Group "${group.name}" Created!`,
			selectGroupsData,
			200,
		);

		response.cookies.set(GROUPS, JSON.stringify(selectGroupsData), {
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
