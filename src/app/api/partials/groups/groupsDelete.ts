import type { SupabaseClient } from '@supabase/supabase-js';
import { toReturn, responseFactory } from '@/utils/api';
import type { GroupData, ReturnData } from '@/app/types';
import { GROUPS } from '@/app/constants';

interface GroupsDeleteArgs {
	group: GroupData;
	supabase: SupabaseClient;
}

export default async function groupsDelete({
	group,
	supabase,
}: GroupsDeleteArgs): Promise<ReturnData> {
	const { data, error } = await supabase
		.from(GROUPS)
		.delete()
		.eq('uid', group.uid)
		.eq('user_uid', group.user_uid);

	return toReturn({
		data,
		error: !error
			? null
			: responseFactory('Error Undoing Creation of Group', error),
	});
}
