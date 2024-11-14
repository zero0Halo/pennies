// src/app/api/accounts/delete/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@/utils/supabase';
import { responseFactory } from '@/utils/api';
import { ACCOUNTS } from '@/app/constants';

export async function POST(req: Request) {
	try {
		const cookieStore = cookies();
		const supabase = createServerClient(cookieStore);
		const { is_default, uid, user_uid } = await req.json();

		// Delete the specified account.
		const { data: accountsDeleteData, error: accountsDeleteError } =
			await supabase
				.from(ACCOUNTS)
				.delete()
				.eq('uid', uid)
				.eq('user_uid', user_uid);

		// If there was error, return 400.
		if (accountsDeleteError)
			return responseFactory('Error Deleting Account', accountsDeleteError);

		// If the account that was deleted was the default, a new default needs to be chosen.
		if (is_default) {
			// Get the first account.
			const { data: firstAccountData, error: firstAccountError } =
				await supabase
					.from(ACCOUNTS)
					.select('*')
					.eq('user_uid', user_uid)
					.limit(1)
					.maybeSingle();

			// If there was an error return 400.
			if (firstAccountError)
				return responseFactory(
					'Error Retrieving The First Account Record',
					firstAccountError,
				);

			// If there was an account left, make it the default.
			if (firstAccountData) {
				const { error: updateError } = await supabase
					.from(ACCOUNTS)
					.update({ is_default: true })
					.eq('user_uid', user_uid)
					.eq('uid', firstAccountData.uid);

				// If there was an error return 400.
				if (updateError)
					return responseFactory(
						'Error Making The First Record the New Default',
						updateError,
					);
			}
		}

		// Get all accounts
		const { data: allAccountsData, error: allAccountsError } = await supabase
			.from(ACCOUNTS)
			.select('*')
			.eq('user_uid', user_uid)
			.order('is_default', { ascending: false });

		// If there was an error return 400.
		if (allAccountsError)
			return responseFactory('Error Retrieving All Accounts', allAccountsError);

		// All done. Create the final response.
		const response = responseFactory(
			'Account Deleted Successfully!',
			accountsDeleteData,
			200,
		);

		// Set the accounts cookie with the updated listing of all accounts
		response.cookies.set(ACCOUNTS, JSON.stringify(allAccountsData), {
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 7, // 1 week
		});

		// We're done. Return 200.
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
