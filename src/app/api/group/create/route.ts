// src/app/api/group/create/route.ts
import { NextResponse } from 'next/server';
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
		console.log({ transfers }, '#######');
		const rollbacks = {
			groups: async () =>
				await superiorBase
					.from(GROUPS)
					.delete()
					.eq('uid', group.uid)
					.eq('user_uid', group.user_uid)
					.go(),
			transactions: async () =>
				await superiorBase
					.from(TRANSACTIONS)
					.delete()
					.in(
						'uid',
						transactions.map((m) => m.uid),
					)
					.go(),
			transfers: async () =>
				await superiorBase
					.from(TRANSFERS)
					.delete()
					.in(
						'uid',
						transfers.map((m) => m.uid),
					)
					.go(),
			monthlySums: async ({
				payload,
				snapshot,
			}: { payload: MonthlySumData[]; snapshot: MonthlySumData[] }) => {
				const { error } = await superiorBase
					.from(MONTHLY_SUMS)
					.delete()
					.in(
						'uid',
						payload.map((m) => m.uid),
					)
					.go();

				return await superiorBase.from(MONTHLY_SUMS).upsert(snapshot).go();
			},
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
			const { error: upsertMonthlySumsDataError } = await superiorBase
				.from(MONTHLY_SUMS)
				.select('*')
				.upsert(monthlySumPayload, { onConflict: 'month_uid_key' })
				.go();

			// ROLLBACK 3: If the upsert fails, rollback everything
			if (upsertMonthlySumsDataError && monthlySumsSnapshot) {
				const { error: transactionsRollbackError } =
					await rollbacks.transactions();
				const { error: groupsRollbackError } = await rollbacks.groups();
				const { error: transfersRollbackError } = await rollbacks.transfers();
				const { error: monthlySumsRollbackError } = await rollbacks.monthlySums(
					{ payload: monthlySumPayload, snapshot: monthlySumsSnapshot },
				);

				if (transactionsRollbackError) return transactionsRollbackError;
				if (groupsRollbackError) return groupsRollbackError;
				if (transfersRollbackError) return transfersRollbackError;
				if (monthlySumsRollbackError) return monthlySumsRollbackError;
				if (upsertMonthlySumsDataError) return upsertMonthlySumsDataError;
			}
		}

		// CREATE THE RESPONSE TO RETURN WITH MONTHLY SUMS DATA
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
