// src/app/api/group-create/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@/utils/supabase/server';
import responseFactory from '../utils/responseFactory';
import { GROUPS, MONTHLY_SUMS, TRANSACTIONS } from '@/app/constants';
import type { MonthlySumData, TransactionData } from '@/app/types';
import monthlySumPayload from '../utils/monthlySumPayload';

import groupsDelete from '../partials/groups/groupsDelete';
import groupsSelect from '../partials/groups/groupsSelect';
import groupsExist from '../partials/groups/groupsExist';
import groupsInsert from '../partials/groups/groupsInsert';
import transactionsUpsert from '../partials/transactions/transactionsUpsert';
import upsertRollback from '../partials/upsertRollback';
import transactionsDelete from '../partials/transactions/transactionsDelete';

export async function POST(req: Request) {
	try {
		const cookieStore = cookies();
		const supabase = createServerClient(cookieStore);
		const { group, transactions } = await req.json();
		const { account_uid, user_uid } = group;

		// Get the description values from groups table
		const { data: descriptionSelectData, error: descriptionSelectError } =
			await groupsSelect({
				account_uid,
				selectFrom: 'description',
				supabase,
				user_uid,
			});

		if (descriptionSelectError) return descriptionSelectError;

		// Check and make sure there isn't a duplicate based on the select data
		const { error: existsError } = await groupsExist(
			descriptionSelectData,
			group,
		);

		if (existsError) return existsError;

		// Insert the group
		const { error: groupInsertError } = await groupsInsert({
			group,
			supabase,
		});

		if (groupInsertError) return groupInsertError;

		// Get all the groups
		const { data: allGroupsData, error: allGroupsError } = await groupsSelect({
			account_uid,
			supabase,
			user_uid,
		});

		if (allGroupsError) return allGroupsError;

		// Upsert the transactions
		const { data: upsertData, error: upsertError } = await transactionsUpsert({
			supabase,
			transactions,
		});

		// If not all the transactions were upserted, roll them all back
		const { error: notAllUpserted } = await upsertRollback({
			data: transactions,
			deletePartial: transactionsDelete,
			supabase,
			upsertData,
		});

		// If there was a problem upserting the transactions, rollback the group's creation
		if (upsertError || notAllUpserted) {
			const { error: groupDeleteError } = await groupsDelete({
				group,
				supabase,
			});

			if (groupDeleteError) return groupDeleteError;

			return upsertError ?? notAllUpserted;
		}

		// const { data: transactionsData, error: transactionsError } =
		// 	await transactionsCreate({ supabase, transactions });

		// // Rollback creating the group if there was an error creating the transactions
		// if (transactionsError) {
		// 	const { error: groupsError } = await groupsDelete({ group, supabase });

		// 	if (groupsError) return groupsError;
		// }

		// // Create Transfers
		// // --------------------------------------------------------------------------------------------
		// // const { data: insertTransfersData, error: insertTransfersError } =
		// // 	await transferCreate(transactions, 'Could Not Create Transfers');

		// // if (insertTransfersError) return insertTransfersError;

		// // Update Month Sums
		// // --------------------------------------------------------------------------------------------

		// // Get all the entries in month_sums
		// const { data: selectMonthlySumData, error: selectMonthlySumError } =
		// 	await supabase
		// 		.from(MONTHLY_SUMS)
		// 		.select('*')
		// 		.eq('user_uid', user_uid)
		// 		.order('month_uid_key', { ascending: false });

		// if (selectMonthlySumError)
		// 	return responseFactory(
		// 		'Unable to Retrieve Monthly Sums',
		// 		selectMonthlySumError,
		// 	);

		// // Generate a payload using this batch of transactions and the sums already recorded in the db
		// const payload: MonthlySumData[] = monthlySumPayload(
		// 	transactions,
		// 	selectMonthlySumData,
		// );

		// // Upsert the entries in payload
		// const { data: dataNoType, error: upsertMonthlySumsError } = await supabase
		// 	.from(MONTHLY_SUMS)
		// 	.upsert(payload, { onConflict: 'month_uid_key' });

		// // Type the data correctly because TS is a bitch
		// const upsertMonthlySumsData = dataNoType as MonthlySumData[] | null;

		// if (upsertMonthlySumsError)
		// 	return responseFactory(
		// 		'Unable to Update Montly Sums',
		// 		upsertMonthlySumsError,
		// 	);

		// // If all the entries weren't upserted throw an error
		// if (
		// 	upsertMonthlySumsData &&
		// 	upsertMonthlySumsData.length !== payload.length
		// ) {
		// 	return responseFactory(
		// 		'All Updates to Monthly Sums Were Not Processed',
		// 		upsertMonthlySumsData,
		// 	);
		// }

		// // Get all the entries again so we can put it in a cookie
		// const {
		// 	data: selectMonthlySumDataCookie,
		// 	error: selectMonthlySumErrorCookie,
		// } = await supabase
		// 	.from(MONTHLY_SUMS)
		// 	.select('*')
		// 	.eq('user_uid', user_uid)
		// 	.order('month_uid_key', { ascending: false });

		// if (selectMonthlySumError)
		// 	return responseFactory(
		// 		'Unable to Retrieve Monthly Sums For Cookie',
		// 		selectMonthlySumErrorCookie,
		// 	);

		const response = responseFactory(
			`Group "${group.name}" Created!`,
			allGroupsData,
			200,
		);

		// response.cookies.set(GROUPS, JSON.stringify(allGroupsData), {
		// 	secure: process.env.NODE_ENV === 'production',
		// 	maxAge: 60 * 60 * 24 * 7, // 1 week
		// });

		// response.cookies.set(
		// 	MONTHLY_SUMS,
		// 	JSON.stringify(selectMonthlySumDataCookie),
		// 	{
		// 		secure: process.env.NODE_ENV === 'production',
		// 		maxAge: 60 * 60 * 24 * 7, // 1 week
		// 	},
		// );

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
