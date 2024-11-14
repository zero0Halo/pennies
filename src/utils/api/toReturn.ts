import type { NextResponse } from 'next/server';
import type { ReturnData } from '@/app/types';

interface ToReturnArgs {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	data?: null | any[] | { description: string }[];
	error?: null | NextResponse;
}

export default function toReturn({
	data = null,
	error = null,
}: ToReturnArgs): Promise<ReturnData> {
	return new Promise((resolve) => resolve({ data, error }));
}
