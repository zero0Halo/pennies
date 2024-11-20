import type { SupabaseClient } from '@supabase/supabase-js';
import { responseFactory, toReturn } from '@/utils/api';
import type { ReturnData, TransferData } from '@/app/types';
import { TRANSFERS } from '@/app/constants';

interface TransfersInsertArgs {
	transfers: TransferData[];
	supabase: SupabaseClient;
}

export default async function transfersInsert({
	transfers,
	supabase,
}: TransfersInsertArgs): Promise<ReturnData> {
	const { data, error } = await supabase.from(TRANSFERS).insert(transfers);

	return toReturn({
		data,
		error: !error ? null : responseFactory('Error Creating Group', error),
	});
}
