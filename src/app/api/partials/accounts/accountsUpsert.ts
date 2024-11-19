import { ACCOUNTS } from '@/app/constants';
import type { SupabaseClient } from '@supabase/supabase-js';
import { responseFactory, toReturn } from '@/utils/api';
import { getIsoDate } from '@/utils/general';
import type { AccountData, ReturnData } from '@/app/types';

interface AccountsUpsertArgs {
	accounts: AccountData[];
	supabase: SupabaseClient;
}

export default async function accountsUpsert({
	accounts,
	supabase,
}: AccountsUpsertArgs): Promise<ReturnData> {
	const updatedAccounts = accounts.map((account) => ({
		...account,
		updated: getIsoDate(),
	}));
	const { data, error } = await supabase.from(ACCOUNTS).upsert(updatedAccounts);

	return toReturn({
		data,
		error: !error ? null : responseFactory('Unable to Upsert Accounts', error),
	});
}
