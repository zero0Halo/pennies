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
import { cookies } from 'next/headers';
import { createServerClient } from '@/utils/supabase/server';
import toReturn from '../utils/toReturn';

interface PartialHelperArgs {
	account_uid?: string;
	user_uid?: string;
}

export default function partialHelper({
	account_uid,
	user_uid,
}: PartialHelperArgs) {
	const cookieStore = cookies();
	const supabase = createServerClient(cookieStore);

	return {
		// groups
		groupsDelete: (group: GroupData) => groupsDeleteFn({ group, supabase }),
		groupsExist,
		groupsInsert: (group: GroupData) => groupsInsertFn({ group, supabase }),
		groupsSelect: (selectFrom?: 'description' | '*' | undefined) =>
			account_uid && user_uid
				? groupsSelectFn({ account_uid, supabase, user_uid, selectFrom })
				: toReturn({}),

		// monthlySums
		monthlySumsRollback: (snapshot: MonthlySumSnapshot) =>
			account_uid && user_uid
				? monthlySumsRollbackFn({ account_uid, snapshot, supabase, user_uid })
				: toReturn({}),
		monthlySumsSelect: () =>
			account_uid && user_uid
				? monthlySumsSelectFn({ account_uid, supabase, user_uid })
				: toReturn({}),
		monthlySumsUpsert: ({ sumData, transactions }: MonthlySumsUpsertFnArgs) =>
			monthlySumsUpsertFn({ sumData, supabase, transactions }),

		// transactions
		transactionsDelete: (data: TransactionData[]) =>
			transactionsDeleteFn({ data, supabase }),
		transactionsUpsert: (transactions: TransactionData[]) =>
			transactionsUpsertFn({ supabase, transactions }),
	};
}
