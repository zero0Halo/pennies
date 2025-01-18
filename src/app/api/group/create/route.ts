// src/app/api/group/create/route.ts
import { NextResponse } from 'next/server';
import partials from '@/app/api/partials';
import { upsertIsGood } from '@/utils/api';
import { GROUPS, MONTHLY_SUMS, TRANSACTIONS, TRANSFERS } from '@/app/constants';
import type {
	GroupData,
	MonthlySumData,
	TransactionData,
	TransferData,
} from '@/app/types';
import superiorBaseFactory from '@/utils/superiorBaseFactory';
import { responseError } from '@/utils/api/responseFactory';
import { createMonthlySumPayload } from '@/app/types/MonthlySumData';

export async function POST(req: Request) {
	try {
		const {
			group,
			transfers,
			transactions,
		}: {
			group: GroupData;
			transfers: TransferData[];
			transactions: TransactionData[];
		} = await req.json();
		const { account_uid, hash, user_uid } = group;
		const superiorBase = await superiorBaseFactory();

		const rollbacks = {
			groups: () => {},
			transactions: () => {},
			transfers: () => {},
		};

		// CHECK AND SEE IF THERE IS ALREADY A HASH THAT MATCHES WHAT WE'RE ABOUT TO TRY AND CREATE.
		// FAIL IF IT DOES EXIST, OR IF THERE IS A DB ERROR.
		const { data: existingGroup, error: existingGroupError } =
			await superiorBase
				.from(GROUPS)
				.select('*')
				.eq('hash', hash)
				.eq('user_uid', user_uid)
				.eq('account_uid', account_uid)
				.successMessage("Can't create Group. Existing Hash")
				.go<GroupData>();

		if (Array.isArray(existingGroup) && existingGroup.length > 0)
			return responseError({
				message: "Can't create Group. Existing Hash",
				data: existingGroup,
			});
		if (existingGroupError) return existingGroupError;

		// INSERT THE GROUP
		const { error: groupInsertError } = await superiorBase
			.from(GROUPS)
			.insert({ ...group })
			.go();
		if (groupInsertError) return groupInsertError;

		// GET A SNAPSHOT OF MONTHLY_SUMS
		const { data: monthlySumsSnapshot, error: monthlySumsSnapshotError } =
			await superiorBase
				.from(MONTHLY_SUMS)
				.select('*')
				.eq('user_uid', user_uid)
				.eq('account_uid', account_uid)
				.order('month_uid_key', { ascending: false })
				.go<MonthlySumData[]>();
		if (monthlySumsSnapshotError) return monthlySumsSnapshotError;

		// INSERT THE TRANSACTIONS
		const { error: insertTransactionsError } = await superiorBase
			.from(TRANSACTIONS)
			.insert(transactions)
			.go<TransactionData[]>();

		// ROLLBACK 1: IF THERE WAS A PROBLEM INSERTING THE TRANSACTIONS, ROLLBACK GROUP
		if (insertTransactionsError) {
			rollbacks.groups = async () =>
				await superiorBase
					.from(GROUPS)
					.delete()
					.eq('uid', group.uid)
					.eq('user_uid', group.user_uid)
					.go();

			const { error: groupRollbackError } = await rollbacks.groups();

			if (groupRollbackError) return groupRollbackError;
			if (insertTransactionsError) return insertTransactionsError;
		}

		// INSERT THE TRANSFERS
		const { error: insertTransfersError } = await superiorBase
			.from(TRANSFERS)
			.insert(transfers)
			.go();

		// ROLLBACK 2: IF THERE WAS A PROBLEM INSERTING TRANSFERS, ROLLBACK TRANSACTIONS & GROUP
		if (insertTransfersError) {
			rollbacks.transactions = async () =>
				await superiorBase
					.from(TRANSACTIONS)
					.delete()
					.in(
						'uid',
						transactions.map((m) => m.uid),
					)
					.go();

			const { error: transactionsRollbackError } =
				await rollbacks.transactions();
			const { error: groupRollbackError } = await rollbacks.groups();

			if (transactionsRollbackError) return transactionsRollbackError;
			if (groupRollbackError) return groupRollbackError;
			if (insertTransfersError) return insertTransfersError;
		}

		// UPSERT/UPDATE THE MONTHLY_SUMS TABLE WITH THIS PAYLOAD
		const monthlySumPayload = createMonthlySumPayload({
			snapshot: monthlySumsSnapshot,
			transfers,
			transactions,
		});

		if (monthlySumPayload !== null) {
			const { data: upsertMonthlySumsData, error: upsertMonthlySumsDataError } =
				await superiorBase
					.from(MONTHLY_SUMS)
					.select('*')
					.upsert(monthlySumPayload, { onConflict: 'month_uid_key' })
					.go();
		}

		// const { data: monthlySumsUpsertData, error: monthlySumsUpsertError } =
		// 	await monthlySumsUpsert({
		// 		snapshot: monthlySumsSnapshot as MonthlySumData[],
		// 		transfers,
		// 		transactions,
		// 	});

		// // Make sure the monthly_sums upsert was completely successful
		// const { error: monthlySumsUpsertNotEqual } = await upsertIsGood({
		// 	data: monthlySumsUpsertData,
		// 	original: monthlySumsSnapshot,
		// });

		// // If there is a problem upserting monthly_sums, rollback monthly_sums, transfers, transactions & group
		// if (monthlySumsUpsertNotEqual || monthlySumsUpsertError) {
		// 	const { error: monthlySumsRollbackError } =
		// 		await monthlySumsRollback(monthlySumsSnapshot);
		// 	const { error: transfersDeleteError } = await transfersDelete(transfers);
		// 	const { error: transactionsDeleteError } =
		// 		await transactionsDelete(transactions);
		// 	const { error: groupDeleteError } = await groupsDelete(group);

		// 	if (monthlySumsUpsertError) return monthlySumsUpsertError;
		// 	if (monthlySumsUpsertNotEqual) return monthlySumsUpsertNotEqual;
		// 	if (monthlySumsRollbackError) return monthlySumsRollbackError;
		// 	if (transfersDeleteError) return transfersDeleteError;
		// 	if (transactionsDeleteError) return transactionsDeleteError;
		// 	if (groupDeleteError) return groupDeleteError;
		// }

		// Create the response to return
		// const response = responseFactory(`Group "${group.name}" Created!`, {}, 200);
		// const superiorBase = await superiorBaseFactory();
		const { error: monthlySumsError, success: response } = await superiorBase
			.from(MONTHLY_SUMS)
			.select('*')
			.eq('account_uid', account_uid)
			.eq('user_uid', user_uid)
			.go<MonthlySumData>();

		if (monthlySumsError || response === null) return monthlySumsError;

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
