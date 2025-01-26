// src/app/api/group/update/route.ts
import superiorBaseFactory from '@/utils/superiorBaseFactory';
import type { GroupData } from '@/app/types';
import { GROUPS } from '@/app/constants';

export async function POST(req: Request) {
	const payload: GroupData = await req.json();

	const superiorBase = await superiorBaseFactory();
	const { error, success: response } = await superiorBase
		.from(GROUPS)
		.update(payload)
		.eq('uid', payload.uid)
		.go<GroupData>();
	if (error || response === null) return error;

	return response;
}
