import { NextResponse } from 'next/server';

interface ResponseFactoryArgs {
	data: object | null;
	error: boolean;
	message: string;
	status: number;
}

interface ResponseArgs {
	data?: object | null;
	message: string;
}

export default function responseFactory({
	data = null,
	error,
	message,
	status,
}: ResponseFactoryArgs): NextResponse {
	return NextResponse.json({ data, error, message }, { status: status ?? 400 });
}

export function responseError({
	data = null,
	message,
}: ResponseArgs): NextResponse {
	console.error({ message, data });
	return responseFactory({ data, error: true, message, status: 400 });
}

export function responseSuccess({
	data = null,
	message,
}: ResponseArgs): NextResponse {
	return responseFactory({ data, error: false, message, status: 200 });
}
