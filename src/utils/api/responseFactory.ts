import { NextResponse } from 'next/server';

export type Data = object | null | undefined;
type Status = number | undefined;

export default function responseFactory(
	message: string,
	data?: Data,
	status?: Status,
): NextResponse {
	return NextResponse.json({ message, data }, { status: status ?? 400 });
}

export function responseError(message: string, data?: Data): NextResponse {
	console.error({ message, data });
	return responseFactory(message, data, 400);
}

export function responseSuccess(message: string, data?: Data): NextResponse {
	console.log({ message, data });
	return responseFactory(message, data, 200);
}
