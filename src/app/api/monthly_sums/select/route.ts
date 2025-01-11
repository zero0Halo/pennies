// src/app/api/monthly_sums/select/route.ts
import superiorBaseFactory from '@/utils/superiorBaseFactory';
import type { MonthlySumData } from '@/app/types';
import { MONTHLY_SUMS } from '@/app/constants';

export async function POST(req: Request) {
	const { account_uid, user_uid } = await req.json();

	const superiorBase = await superiorBaseFactory();
	const { error, success: response } = await superiorBase
		.from(MONTHLY_SUMS)
		.select('*')
		.eq('account_uid', account_uid)
		.eq('user_uid', user_uid)
		.go<MonthlySumData>();
	if (error || response === null) return error;

	return response;
}
