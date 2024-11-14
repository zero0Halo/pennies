import { responseFactory, toReturn } from '@/utils/api';
import type { ReturnData } from '@/app/types';

interface UpsertIsGoodArgs {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	data: any[] | undefined | null;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	original: any[] | undefined | null;
}

export default async function upsertIsGood({
	data,
	original,
}: UpsertIsGoodArgs): Promise<ReturnData> {
	let dataResponse = null;
	let errorResponse = null;

	if (data && original) {
		const isGood = data.length && original.length;
		if (isGood) dataResponse = [];
		if (!isGood)
			errorResponse = responseFactory('Upsert Lengths Are Not Equal');
	}

	return toReturn({ data: dataResponse, error: errorResponse });
}
