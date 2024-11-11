import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers';
import type { TransactionData, TransferData } from '@/app/types';
import { TRANSFER, TRANSFERS } from '@/app/constants';
import { createServerClient } from '@/utils/supabase/server';
import responseFactory from './responseFactory';
import type { NextResponse } from 'next/server';

export default async function transferCreate(
	transactions: TransactionData[],
	msg: string,
): Promise<{ data: TransferData[] | null; error: NextResponse | null }> {
	const transfers: TransactionData[] = transactions.filter(
		(transaction) => transaction.category === TRANSFER,
	);

	if (transfers.length === 0) return { data: null, error: null };

	const cookieStore = cookies();
	const supabase = createServerClient(cookieStore);
	const { user_uid } = transactions[0];
	const isoDate = new Date().toISOString();
	const transferPayload: TransferData[] = transfers.map((transaction) => ({
		amount: transaction.amount * -1,
		created: isoDate,
		description: transaction.description,
		from_account_uid: transaction.account_uid,
		timestamp: transaction.timestamp,
		to_account_uid: transaction?.transfer_uid ?? '',
		uid: uuidv4(),
		updated: isoDate,
		user_uid,
	}));
	console.log({ transferPayload });
	const { data, error } = await supabase
		.from(TRANSFERS)
		.insert(transferPayload);
	const responseError = error ? responseFactory(msg, error) : null;

	return new Promise((resolve) => resolve({ data, error: responseError }));
}
