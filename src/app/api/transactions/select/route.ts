// src/app/api/transactions/select/route.ts
import superiorBaseFactory from '@/utils/superiorBaseFactory';
import type { TransactionData } from '@/app/types';
import { TRANSACTIONS } from '@/app/constants';

export async function POST(req: Request) {
	// This endpoint allows transaction(s) to be selected by EITHER hashes or uid, not both
	const { hashes, uid } = await req.json();

	const superiorBase = await superiorBaseFactory();
	let query = superiorBase.from(TRANSACTIONS).select('*');
	query = hashes ? query.in('hash', hashes) : query.eq('uid', uid).single();

	const { error, success: response } = await query.go<
		TransactionData[] | TransactionData
	>();

	if (error || response === null) return error;

	return response;
}
