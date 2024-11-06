// src/app/api/group-create/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@/utils/supabase/server';
import responseFactory from '../utils/responseFactory';
import { GROUPS, MONTHLY_SUMS, TRANSACTIONS } from '@/app/constants';
import type { MonthlySumData, TransactionData } from '@/app/types';
import monthlySumPayload from '../utils/monthlySumPayload';

export async function POST(req: Request) {
	try {
		const cookieStore = cookies();
		const supabase = createServerClient(cookieStore);
		const { group, transactions } = await req.json();
		const { user_uid } = group;

		// Get the description values from groups table
		const { data: descriptionSelectData, error: descriptionSelectError } =
			await supabase
				.from(GROUPS)
				.select('description')
				.eq('user_uid', user_uid);

		if (descriptionSelectError)
			return responseFactory(
				"Error Retrieving Group Prime's",
				descriptionSelectError,
			);

		if (descriptionSelectData.includes(group.description))
			return responseFactory(
				'A Group With This Prime Already Exists',
				descriptionSelectData,
			);

		const { error: insertGroupError } = await supabase
			.from(GROUPS)
			.insert({ ...group });

		if (insertGroupError)
			return responseFactory('Error Creating Group', insertGroupError);

		// Get all of the groups
		const { data: selectGroupsData, error: selectGroupsError } = await supabase
			.from(GROUPS)
			.select('*')
			.eq('user_uid', user_uid)
			.order('created', { ascending: false });

		if (selectGroupsError)
			return responseFactory('Error Retrieving Groups Data', selectGroupsError);

		// Create Transactions
		// --------------------------------------------------------------------------------------------
		const { data, error: upsertTransactionsError } = await supabase
			.from(TRANSACTIONS)
			.upsert(transactions, {
				ignoreDuplicates: true,
				onConflict: 'description',
			});
		const upsertTransactionsData = data as TransactionData[] | null;

		// If there is an error with the upsert, roll back the creation of the group
		if (upsertTransactionsError) {
			const { error: deleteGroupError } = await supabase
				.from(GROUPS)
				.delete()
				.eq('uid', group.uid);

			if (deleteGroupError)
				return responseFactory(
					'Error Undoing Creation of Group',
					deleteGroupError,
				);

			return responseFactory(
				'Error Creating Transactions for Group. Aborting.',
				upsertTransactionsData,
			);
		}

		// If some transactions weren't inserted then error out
		if (
			Array.isArray(upsertTransactionsData) &&
			upsertTransactionsData.length < transactions.length
		)
			responseFactory('Some Transactions Were Identified As Duplicates');

		// Update Month Sums
		// --------------------------------------------------------------------------------------------

		// Get all the entries in month_sums
		const { data: selectMonthlySumData, error: selectMonthlySumError } =
			await supabase
				.from(MONTHLY_SUMS)
				.select('*')
				.eq('user_uid', user_uid)
				.order('month_uid_key', { ascending: false });

		if (selectMonthlySumError)
			return responseFactory(
				'Unable to Retrieve Monthly Sums',
				selectMonthlySumError,
			);

		// Generate a payload using this batch of transactions and the sums already recorded in the db
		const payload: MonthlySumData[] = monthlySumPayload(
			transactions,
			selectMonthlySumData,
		);

		// Upsert the entries in payload
		const { data: dataNoType, error: upsertMonthlySumsError } = await supabase
			.from(MONTHLY_SUMS)
			.upsert(payload, { onConflict: 'month_uid_key' });

		// Type the data correctly because TS is a bitch
		const upsertMonthlySumsData = dataNoType as MonthlySumData[] | null;

		if (upsertMonthlySumsError)
			return responseFactory(
				'Unable to Update Montly Sums',
				upsertMonthlySumsError,
			);

		// If all the entries weren't upserted throw an error
		if (
			upsertMonthlySumsData &&
			upsertMonthlySumsData.length !== payload.length
		) {
			return responseFactory(
				'All Updates to Monthly Sums Were Not Processed',
				upsertMonthlySumsData,
			);
		}

		// Get all the entries again so we can put it in a cookie
		const {
			data: selectMonthlySumDataCookie,
			error: selectMonthlySumErrorCookie,
		} = await supabase
			.from(MONTHLY_SUMS)
			.select('*')
			.eq('user_uid', user_uid)
			.order('month_uid_key', { ascending: false });

		if (selectMonthlySumError)
			return responseFactory(
				'Unable to Retrieve Monthly Sums For Cookie',
				selectMonthlySumErrorCookie,
			);

		const response = responseFactory(
			`Group "${group.name}" Created!`,
			selectGroupsData,
			200,
		);

		response.cookies.set(GROUPS, JSON.stringify(selectGroupsData), {
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 7, // 1 week
		});

		response.cookies.set(
			MONTHLY_SUMS,
			JSON.stringify(selectMonthlySumDataCookie),
			{
				secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60 * 24 * 7, // 1 week
			},
		);

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
