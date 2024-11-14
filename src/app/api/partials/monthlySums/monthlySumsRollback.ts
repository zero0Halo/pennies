import type { MonthlySumData } from '@/app/types';
import type { ReturnData } from '../../../../utils/utils/toReturn';
import { MONTHLY_SUMS } from '@/app/constants';
import type { SupabaseClient } from '@supabase/supabase-js';
import toReturn from '../../../../utils/utils/toReturn';
import responseFactory from '../../../../utils/utils/responseFactory';

export type MonthlySumSnapshot = MonthlySumData[] | undefined | null;

interface MonthlySumsRollbackArgs {
	account_uid: string;
	snapshot: MonthlySumSnapshot;
	supabase: SupabaseClient;
	user_uid: string;
}

export default async function monthlySumsRollback({
	account_uid,
	snapshot,
	supabase,
	user_uid,
}: MonthlySumsRollbackArgs): Promise<ReturnData> {
	let dataResponse = null;
	let errorResponse = null;

	if (snapshot) {
		const { error: deleteError } = await supabase
			.from(MONTHLY_SUMS)
			.delete()
			.in(
				'uid',
				snapshot.map((m) => m.uid),
			)
			.eq('user_uid', user_uid)
			.eq('account_uid', account_uid);

		if (errorResponse)
			return toReturn({
				error: responseFactory(
					'There was a problem deleting monthly sums',
					deleteError,
				),
			});

		const { data, error: upsertError } = await supabase
			.from(MONTHLY_SUMS)
			.upsert(snapshot);

		dataResponse = data;

		if (upsertError)
			errorResponse = responseFactory(
				'There was an error restoring the monthly sums snapshot',
				upsertError,
			);
	}

	return toReturn({ data: dataResponse, error: errorResponse });
}
