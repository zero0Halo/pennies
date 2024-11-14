import { NextResponse } from 'next/server';

export default function responseFactory(
	message: string,
	data?: object | null | undefined,
	status?: number | undefined,
) {
	console.error({ message, data, status });
	return NextResponse.json({ message, data }, { status: status ?? 400 });
}
