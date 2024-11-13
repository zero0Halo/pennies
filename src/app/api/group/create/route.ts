// src/app/api/group/create/route.ts
import { NextResponse } from 'next/server';
import partialHelper from '@/app/api/partials/partialsHelper';
import { cookieJar, responseFactory, upsertIsGood } from '@/app/api/utils';
import { MONTHLY_SUMS } from '@/app/constants';

export async function POST(req: Request) {
	try {
		const { group, transactions } = await req.json();
		const { account_uid, user_uid } = group;
		const {
			groupsDelete,
			groupsExist,
			groupsInsert,
			groupsSelect,
			monthlySumsRollback,
			monthlySumsSelect,
			monthlySumsUpsert,
			transactionsDelete,
			transactionsUpsert,
		} = partialHelper({
			account_uid,
			user_uid,
		});

		// Get a snapshot of group descriptions
		const { data: descriptionsSnapshot, error: descriptionsSnapshotError } =
			await groupsSelect('description');
		if (descriptionsSnapshotError) return descriptionsSnapshotError;

		// Check and make sure there isn't a duplicate group based on the descriptions snapshot
		const { error: existsError } = await groupsExist({
			data: descriptionsSnapshot,
			group,
		});
		if (existsError) return existsError;

		// Insert the group
		const { error: groupInsertError } = await groupsInsert(group);
		if (groupInsertError) return groupInsertError;

		// Get a snapshot of monthly_sums
		const { data: monthlySumsSnapshot, error: monthlySumsSnapshotError } =
			await monthlySumsSelect();
		if (monthlySumsSnapshotError) return monthlySumsSnapshotError;

		// Upsert the transactions
		const { data: transactionsData, error: transactionsError } =
			await transactionsUpsert(transactions);

		// Make sure the transactions upsert was completely successful
		const { error: transactionsUpsertIsBad } = await upsertIsGood({
			data: transactionsData,
			original: transactions,
		});

		// If there was a problem upserting the transactions, rollback transactions and group
		if (transactionsError || transactionsUpsertIsBad) {
			const { error: transactionsDeleteError } =
				await transactionsDelete(transactions);
			const { error: groupDeleteError } = await groupsDelete(group);

			if (transactionsError) return transactionsError;
			if (transactionsUpsertIsBad) return transactionsUpsertIsBad;
			if (transactionsDeleteError) return transactionsDeleteError;
			if (groupDeleteError) return groupDeleteError;
		}

		// Upsert/Update the updated data back into monthly_sums
		const { data: monthlySumsUpsertData, error: monthlySumsUpsertError } =
			await monthlySumsUpsert({
				sumData: monthlySumsSnapshot,
				transactions,
			});

		// Make sure the monthly_sums upsert was completely successful
		const { error: monthlySumsUpsertNotEqual } = await upsertIsGood({
			data: monthlySumsUpsertData,
			original: monthlySumsSnapshot,
		});

		// If there is a problem upserting monthly_sums, rollback monthly_sums, transactions & group
		if (monthlySumsUpsertNotEqual || monthlySumsUpsertError) {
			const { error: monthlySumsRollbackError } =
				await monthlySumsRollback(monthlySumsSnapshot);
			const { error: transactionsDeleteError } =
				await transactionsDelete(transactions);
			const { error: groupDeleteError } = await groupsDelete(group);

			if (monthlySumsUpsertError) return monthlySumsUpsertError;
			if (monthlySumsUpsertNotEqual) return monthlySumsUpsertNotEqual;
			if (monthlySumsRollbackError) return monthlySumsRollbackError;
			if (transactionsDeleteError) return transactionsDeleteError;
			if (groupDeleteError) return groupDeleteError;
		}

		// Create the response to return
		const response = responseFactory(`Group "${group.name}" Created!`, {}, 200);

		// Get monthly_sum data for the cookie
		const { data: monthlySumsCookie, error: groupsCookieError } =
			await monthlySumsSelect();
		if (groupsCookieError) return groupsCookieError;

		// Add the data to the cookie
		response.cookies.set(
			...cookieJar({ name: MONTHLY_SUMS, data: monthlySumsCookie }),
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
