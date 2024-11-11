import type { SupabaseClient } from '@supabase/supabase-js';
import { GROUPS } from '@/app/constants';
import type { GroupData } from '@/app/types';
import responseFactory from '../../utils/responseFactory';
import toReturn, { type ReturnData } from '../../utils/toReturn';

interface GroupsInsertArgs {
	group: GroupData;
	supabase: SupabaseClient;
}

export default async function groupsInsert({
	group,
	supabase,
}: GroupsInsertArgs): Promise<ReturnData> {
	const { data, error } = await supabase.from(GROUPS).insert({ ...group });

	return toReturn({
		data,
		error: !error ? null : responseFactory('Error Creating Group', error),
	});
}
