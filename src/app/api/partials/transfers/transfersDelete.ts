import type { SupabaseClient } from '@supabase/supabase-js';
import { responseFactory, toReturn } from '@/utils/api';
import type { ReturnData, TransferData } from '@/app/types';
import { TRANSFERS } from '@/app/constants';

interface TransfersDeleteArgs {
	data: TransferData[];
	supabase: SupabaseClient;
}

export default async function transfersDelete({
	supabase,
	data: transfersData,
}: TransfersDeleteArgs): Promise<ReturnData> {
	const { data, error } = await supabase
		.from(TRANSFERS)
		.delete()
		.in(
			'uid',
			transfersData.map((transfer) => transfer.uid),
		)
		.eq('user_uid', transfersData[0].user_uid);

	return toReturn({
		data,
		error: !error ? null : responseFactory('Error Deleting Transfers', error),
	});
}
