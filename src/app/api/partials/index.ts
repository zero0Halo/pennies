import { cookies } from 'next/headers';
// accounts
import accountsDeleteFn from './accounts/accountsDelete';
import accountsSelectFn from './accounts/accountsSelect';
import accountsUpdateFn from './accounts/accountsUpdate';
import accountsUpsertFn from './accounts/accountsUpsert';
// groups
import groupsDeleteFn from './groups/groupsDelete';
import groupsExist from './groups/groupsExist';
import groupsInsertFn from './groups/groupsInsert';
import groupsSelectFn from './groups/groupsSelect';
// monthly_sums
import monthlySumsRollbackFn, {
	type MonthlySumSnapshot,
} from './monthlySums/monthlySumsRollback';
import monthlySumsSelectFn from './monthlySums/monthlySumsSelect';
import monthlySumsUpsertFn, {
	type MonthlySumsUpsertFnArgs,
} from './monthlySums/monthlySumsUpsert';
// TRANSFERS
import transfersDeleteFn from './transfers/transfersDelete';
import transfersInsertFn from './transfers/transfersInsert';
// transactions
import transactionsDeleteFn from './transactions/transactionsDelete';
import transactionsUpsertFn from './transactions/transactionsUpsert';
// types
import { createServerClient } from '@/utils/supabase';
import { toReturn } from '@/utils/api';
import type {
	AccountData,
	GroupData,
	TransactionData,
	TransferData,
} from '@/app/types';

interface PartialsArgs {
	account_uid?: string;
	user_uid?: string;
}

export default function partials({ account_uid, user_uid }: PartialsArgs) {
	const cookieStore = cookies();
	const supabase = createServerClient(cookieStore);

	return {
		// accounts
		accountsDelete: (account: AccountData) =>
			user_uid
				? accountsDeleteFn({ account, supabase, user_uid })
				: toReturn({}),
		accountsSelect: (selectFrom?: '*' | 'is_default') =>
			user_uid
				? accountsSelectFn({ selectFrom, supabase, user_uid })
				: toReturn({}),
		accountsUpdate: (account: AccountData) =>
			user_uid
				? accountsUpdateFn({ account, supabase, user_uid })
				: toReturn({}),
		accountsUpsert: (accounts: AccountData[]) =>
			accountsUpsertFn({ accounts, supabase }),
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
		monthlySumsUpsert: ({
			snapshot,
			transfers,
			transactions,
		}: MonthlySumsUpsertFnArgs) =>
			monthlySumsUpsertFn({ snapshot, supabase, transfers, transactions }),

		// transactions
		transactionsDelete: (data: TransactionData[]) =>
			transactionsDeleteFn({ data, supabase }),
		transactionsUpsert: (transactions: TransactionData[]) =>
			transactionsUpsertFn({ supabase, transactions }),

		// TRANSFERS
		transfersDelete: (data: TransferData[]) =>
			transfersDeleteFn({ supabase, data }),
		transfersInsert: (transfers: TransferData[]) =>
			transfersInsertFn({ supabase, transfers }),
	};
}
