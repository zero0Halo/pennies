import type { SupabaseClient } from '@supabase/supabase-js';
import { responseFactory, toReturn } from '@/utils/api';
import type { ReturnData } from '@/app/types';
import { GROUPS } from '@/app/constants';

interface GroupsSelectArgs {
	account_uid: string;
	selectFrom?: 'description' | '*';
	supabase: SupabaseClient;
	user_uid: string;
}

export default async function groupsSelect({
	account_uid,
	selectFrom = '*',
	supabase,
	user_uid,
}: GroupsSelectArgs): Promise<ReturnData> {
	const { data, error } = await supabase
		.from(GROUPS)
		.select(selectFrom)
		.eq('user_uid', user_uid)
		.eq('account_uid', account_uid);

	return toReturn({
		data,
		error: !error
			? null
			: responseFactory('Could Not Get Data for Groups', error),
	});
}
