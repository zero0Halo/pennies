import { NextResponse } from 'next/server';

type Data = object | null | undefined;
type Status = number | undefined;
type ResponseFactoryArgs = [message: string, data?: Data, status?: Status];
type ResponseData = {
	message: string;
	data: Data;
};

export default function responseFactory(
	...args: ResponseFactoryArgs
): NextResponse {
	const [message, data, status] = args;

	return NextResponse.json<ResponseData>(
		{ message, data },
		{ status: status ?? 400 },
	);
}

export function responseError(message: string, data?: Data): NextResponse {
	console.error('responseError', { message, data });
	return responseFactory(message, data, 400);
}

export function responseSuccess(message: string, data?: Data): NextResponse {
	console.log('responseSuccess', { message, data });
	return responseFactory(message, data, 200);
}
