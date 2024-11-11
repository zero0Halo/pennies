import type { SupabaseClient } from '@supabase/supabase-js';
import responseFactory from '../utils/responseFactory';
import toReturn, { type ReturnData } from '../utils/toReturn';

interface UpsertRollbackArgs {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	upsertData: any[];
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	data: any[];
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	deletePartial: (args: any) => Promise<ReturnData>;
	supabase: SupabaseClient;
}

export default async function upsertRollback({
	upsertData,
	data,
	deletePartial,
	supabase,
}: UpsertRollbackArgs) {
	let errorResponse = null;

	if (upsertData && upsertData.length !== data.length) {
		const { data: deleteSuccess, error: deleteError } = await deletePartial({
			supabase,
			data,
		});

		if (deleteError) errorResponse = deleteError;

		// A successful delete still returns an error because this is a rollback
		if (deleteSuccess)
			errorResponse = responseFactory(
				'Some Data Could Not be Upserted. Aborting',
				deleteSuccess,
			);
	}

	return toReturn({ error: errorResponse });
}
