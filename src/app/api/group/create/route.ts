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
import groupSetup from './groupSetup';
import monthlySumsSetup from './monthlySumsSetup';
import transactionsSetup from './transactionsSetup';
import transfersSetup from './transfersSetup';

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
		const superiorBase = await superiorBaseFactory();
		const groupMethods = groupSetup({ group, superiorBase });
		const monthlySumsMethods = monthlySumsSetup({
			group,
			superiorBase,
			transactions,
			transfers,
		});
		const transactionsMethods = transactionsSetup({
			superiorBase,
			transactions,
		});
		const transfersMethods = transfersSetup({
			superiorBase,
			transfers,
		});

		// MAKE SURE THE GROUP HAS A UNIQUE HASH THAT DOESN'T EXIST IN THE DB
		const { error: notUniqueResponse } = await groupMethods.uniqueCheck();
		if (notUniqueResponse) return notUniqueResponse;

		// INSERT THE NEW GROUP
		const { error: groupInsertError } = await groupMethods.insert();
		if (groupInsertError) return groupInsertError;

		// GET A SNAPSHOT OF MONTHLY_SUMS TO USE TO RESET IN CASE OF ERRORS
		const { error: monthlySumsSnapshotError } =
			await monthlySumsMethods.snapshot();
		if (monthlySumsSnapshotError) return monthlySumsSnapshotError;

		// INSERT THE TRANSACTIONS
		const { error: insertTransactionsError } =
			await transactionsMethods.insert();

		// ROLLBACK 1: IF THERE WAS A PROBLEM INSERTING THE TRANSACTIONS, ROLLBACK GROUP
		if (insertTransactionsError) {
			const { error: groupRollbackError } = await groupMethods.rollback();

			if (groupRollbackError) return groupRollbackError;
			if (insertTransactionsError) return insertTransactionsError;
		}

		// INSERT THE TRANSFERS
		const { error: insertTransfersError } = await transfersMethods.insert();

		// ROLLBACK 2: IF THERE WAS A PROBLEM INSERTING TRANSFERS, ROLLBACK TRANSACTIONS & GROUP
		if (insertTransfersError) {
			const { error: transactionsRollbackError } =
				await transactionsMethods.rollback();
			const { error: groupRollbackError } = await groupMethods.rollback();

			if (transactionsRollbackError) return transactionsRollbackError;
			if (groupRollbackError) return groupRollbackError;
			if (insertTransfersError) return insertTransfersError;
		}

		// UPSERT THE NEW/UPDATED MONTHLY SUMS DATA
		const { error: upsertMonthlySumsError } = await monthlySumsMethods.upsert();

		// ROLLBACK 3: IF THERE WAS A PROBLEM UPSERTING MONTHLY SUMS, ROLLBACK TRANSACTIONS, TRANSFERS & GROUP
		if (upsertMonthlySumsError) {
			const { error: transactionsRollbackError } =
				await transactionsMethods.rollback();
			const { error: groupsRollbackError } = await groupMethods.rollback();
			const { error: transfersRollbackError } =
				await transfersMethods.rollback();
			const { error: monthlySumsRollbackError } =
				await monthlySumsMethods.rollback();

			if (transactionsRollbackError) return transactionsRollbackError;
			if (groupsRollbackError) return groupsRollbackError;
			if (transfersRollbackError) return transfersRollbackError;
			if (monthlySumsRollbackError) return monthlySumsRollbackError;
			if (upsertMonthlySumsError) return upsertMonthlySumsError;
		}

		// CREATE THE RESPONSE TO RETURN WITH MONTHLY SUMS DATA
		const { error: monthlySumsSnapshot2Error, success } =
			await monthlySumsMethods.snapshot();
		if (monthlySumsSnapshot2Error || success === null)
			return monthlySumsSnapshot2Error;

		return success;
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
