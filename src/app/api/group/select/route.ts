// src/app/api/monthly_sums/select/route.ts
import superiorBaseFactory from '@/utils/superiorBaseFactory';
import type { GroupData } from '@/app/types';
import { GROUPS } from '@/app/constants';

export async function POST(req: Request) {
	const { uid } = await req.json();

	const superiorBase = await superiorBaseFactory();
	const { error, success: response } = await superiorBase
		.from(GROUPS)
		.select('*')
		.eq('uid', uid)
		.single()
		.go<GroupData>();
	if (error || response === null) return error;

	return response;
}
