// src/app/api/home/select/route.ts
import { NextResponse } from 'next/server';
import type { AccountData, UserData } from '@/app/types';
import partials from '../../partials';
import { responseError, responseSuccess } from '@/utils/api/responseFactory';

export async function POST(req: Request) {
	try {
		const {
			account,
			accounts,
			month,
			user,
		}: {
			account?: AccountData;
			accounts?: AccountData[];
			month: number;
			user: UserData;
		} = await req.json();
		const accountData =
			account ??
			(Array.isArray(accounts)
				? accounts.find(({ is_default }) => is_default)
				: undefined);

		if (!accountData)
			return responseError(
				'Need an account to determine what transactions to display',
			);

		const { transactionsSelect } = partials({
			account_uid: accountData.uid,
			user_uid: user.uid,
		});

		const { data, error } = await transactionsSelect(month);

		if (error) return error;

		return responseSuccess('Transactions Retrieved!', data);
	} catch (error: unknown) {
		const errorMessage =
			error instanceof Error ? error.message : 'Unknown error';
		return NextResponse.json(
			{ message: 'Server error', error: errorMessage },
			{ status: 500 },
		);
	}
}
