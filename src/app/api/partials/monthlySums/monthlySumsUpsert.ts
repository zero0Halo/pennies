import type { SupabaseClient } from '@supabase/supabase-js';
import { monthlySumPayload, responseFactory, toReturn } from '@/utils/api';
import type { MonthlySumData, ReturnData, TransactionData } from '@/app/types';
import { MONTHLY_SUMS } from '@/app/constants';

export interface MonthlySumsUpsertFnArgs {
	sumData: MonthlySumData[] | undefined | null;
	transactions: TransactionData[];
}

interface MonthlySumsUpsertArgs extends MonthlySumsUpsertFnArgs {
	supabase: SupabaseClient;
}

export default async function monthlySumsUpsert({
	sumData,
	supabase,
	transactions,
}: MonthlySumsUpsertArgs): Promise<ReturnData> {
	let dataResponse = null;
	let errorResponse = null;

	if (sumData) {
		const payload: MonthlySumData[] = monthlySumPayload(transactions, sumData);

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
