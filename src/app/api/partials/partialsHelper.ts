import type { SupabaseClient } from '@supabase/supabase-js';
// groups
import groupsDeleteFn from '../partials/groups/groupsDelete';
import groupsExist from '../partials/groups/groupsExist';
import groupsInsertFn from '../partials/groups/groupsInsert';
import groupsSelectFn from '../partials/groups/groupsSelect';
// monthly_sums
import monthlySumsRollbackFn, {
	type MonthlySumSnapshot,
} from './monthlySums/monthlySumsRollback';
import monthlySumsSelectFn from '../partials/monthlySums/monthlySumsSelect';
import monthlySumsUpsertFn, {
	type MonthlySumsUpsertFnArgs,
} from '../partials/monthlySums/monthlySumsUpsert';
// transactions
import transactionsDeleteFn from './transactions/transactionsDelete';
import transactionsUpsertFn from '../partials/transactions/transactionsUpsert';
// types
import type { GroupData, TransactionData } from '@/app/types';

interface PartialHelperArgs {
	account_uid: string;
	supabase: SupabaseClient;
	user_uid: string;
}

export default function partialHelper({
	account_uid,
	supabase,
	user_uid,
}: PartialHelperArgs) {
	return {
		// groups
		groupsDelete: (group: GroupData) => groupsDeleteFn({ group, supabase }),
		groupsExist,
		groupsInsert: (group: GroupData) => groupsInsertFn({ group, supabase }),
		groupsSelect: (selectFrom?: 'description' | '*' | undefined) =>
			groupsSelectFn({ account_uid, supabase, user_uid, selectFrom }),

		// monthlySums
		monthlySumsRollback: (snapshot: MonthlySumSnapshot) =>
			monthlySumsRollbackFn({ account_uid, snapshot, supabase, user_uid }),
		monthlySumsSelect: () =>
			monthlySumsSelectFn({ account_uid, supabase, user_uid }),
		monthlySumsUpsert: ({ sumData, transactions }: MonthlySumsUpsertFnArgs) =>
			monthlySumsUpsertFn({ sumData, supabase, transactions }),

		// transactions
		transactionsDelete: (data: TransactionData[]) =>
			transactionsDeleteFn({ data, supabase }),
		transactionsUpsert: (transactions: TransactionData[]) =>
			transactionsUpsertFn({ supabase, transactions }),
	};
}
