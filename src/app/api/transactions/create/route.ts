// src/app/api/transactions/create/route.ts
import superiorBaseFactory from '@/utils/superiorBaseFactory';
import {
	createTransferPayload,
	type CreateTransferPayloadData,
	type MonthlySumData,
	type TransactionData,
} from '@/app/types';
import {
	MONTHLY_SUMS,
	TRANSACTIONS,
	TRANSFER,
	TRANSFERS,
} from '@/app/constants';
import { createMonthlySumPayload } from '@/app/types/MonthlySumData';
import { cookieJar } from '@/utils/api';

export async function POST(req: Request) {
	const payload: TransactionData = await req.json();
	const superiorBase = await superiorBaseFactory();
	let transfersPayload: CreateTransferPayloadData | null = null;

	// Snapshot of monthly sums
	const { data: monthlySumsSnapshot, error: monthlySumsSnapshotError } =
		await superiorBase
			.from(MONTHLY_SUMS)
			.select('*')
			.go<MonthlySumData[] | null>();
	if (monthlySumsSnapshot === null || monthlySumsSnapshotError)
		return monthlySumsSnapshotError;

	// Insert transaction
	const { data: transactionData, error: transactionDataError } =
		await superiorBase
			.from(TRANSACTIONS)
			.insert(payload)
			.go<TransactionData | null>();
	if (transactionData === undefined || transactionDataError)
		return transactionDataError;

	// If the transaction is a transfer, create the payload and insert transfer
	if (payload.category === TRANSFER) {
		transfersPayload = createTransferPayload({
			transactions: [payload],
			group: null,
		});

		const { error: transfersDataError } = await superiorBase
			.from(TRANSFERS)
			.insert(transfersPayload)
			.go();
		if (transfersDataError) return transfersDataError;
	}

	// Create the monthlySum payload
	const monthlySumPayload: MonthlySumData[] | null = createMonthlySumPayload({
		snapshot: monthlySumsSnapshot as MonthlySumData[],
		transfers:
			transfersPayload === null ? transfersPayload : transfersPayload.transfers,
		transactions: [payload],
	});

	// Upsert monthlySumPayload
	const {
		data: monthlySumsData,
		success: response,
		error: monthlySumsDataError,
	} = await superiorBase
		.from(MONTHLY_SUMS)
		.upsert(monthlySumPayload, { onConflict: 'month_uid_key' })
		.go<MonthlySumData[]>();
	if (response === null || monthlySumsDataError) return monthlySumsDataError;

	response.cookies.set(
		...cookieJar({ name: MONTHLY_SUMS, data: monthlySumsData }),
	);

	return response;
}
