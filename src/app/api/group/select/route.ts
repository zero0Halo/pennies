// src/app/api/monthly_sums/select/route.ts
import superiorBaseFactory from '@/utils/superiorBaseFactory';
import type { GroupData } from '@/app/types';
import { GROUPS } from '@/app/constants';

export async function POST(req: Request) {
	// This endpoint allows group(s) to be selected by EITHER hashes or uid, not both
	const { hashes, uid } = await req.json();

	const superiorBase = await superiorBaseFactory();
	let query = superiorBase.from(GROUPS).select('*');
	query = hashes ? query.in('hash', hashes) : query.eq('uid', uid).single();

	const { error, success: response } = await query.go<
		GroupData | GroupData[]
	>();

	if (error || response === null) return error;

	return response;
}
