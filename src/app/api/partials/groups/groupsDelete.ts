import type { SupabaseClient } from '@supabase/supabase-js';
import toReturn, { type ReturnData } from '@/app/api/utils/toReturn';
import responseFactory from '@/app/api/utils/responseFactory';
import type { GroupData } from '@/app/types';
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
