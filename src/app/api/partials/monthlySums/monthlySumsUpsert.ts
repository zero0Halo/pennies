import type { SupabaseClient } from '@supabase/supabase-js';
import { monthlySumPayload, responseFactory, toReturn } from '@/utils/api';
import type {
	MonthlySumData,
	ReturnData,
	TransactionData,
	TransferData,
} from '@/app/types';
import { MONTHLY_SUMS } from '@/app/constants';
import { createMonthlySumPayload } from '@/app/types/MonthlySumData';

export interface MonthlySumsUpsertFnArgs {
	snapshot: MonthlySumData[] | null;
	transfers: TransferData[] | null;
	transactions: TransactionData[];
}

interface MonthlySumsUpsertArgs extends MonthlySumsUpsertFnArgs {
	supabase: SupabaseClient;
}

export default async function monthlySumsUpsert({
	snapshot,
	supabase,
	transfers,
	transactions,
}: MonthlySumsUpsertArgs): Promise<ReturnData> {
	let dataResponse = null;
	let errorResponse = null;

	if (snapshot) {
		const payload: MonthlySumData[] | null = createMonthlySumPayload({
			snapshot,
			transfers,
			transactions,
		});

		const { data, error } = await supabase
			.from(MONTHLY_SUMS)
			.upsert(payload, { onConflict: 'month_uid_key' });

		dataResponse = data;
		errorResponse = !error
			? null
			: responseFactory('Unable to Update Montly Sums', error);
	}

	return toReturn({
		data: dataResponse,
		error: errorResponse,
	});
}
