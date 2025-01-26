// src/app/api/monthly_sums/select/route.ts
import superiorBaseFactory from '@/utils/superiorBaseFactory';
import type { TransactionData } from '@/app/types';
import { TRANSACTIONS } from '@/app/constants';

export async function POST(req: Request) {
	const { group_uid } = await req.json();

	const superiorBase = await superiorBaseFactory();
	const { error, success: response } = await superiorBase
		.from(TRANSACTIONS)
		.select('*')
		.eq('group_uid', group_uid)
		.go<TransactionData[]>();
	if (error || response === null) return error;

	return response;
}
