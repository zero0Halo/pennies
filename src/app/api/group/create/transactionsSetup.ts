import { GROUPS, TRANSACTIONS } from '@/app/constants';
import type { GroupData, TransactionData } from '@/app/types';
import { responseError } from '@/utils/api/responseFactory';
import type { SuperiorBase } from '@/utils/superiorBaseFactory';

export default function transactionsSetup({
	transactions,
	superiorBase,
}: { transactions: TransactionData[]; superiorBase: SuperiorBase }) {
	///////////////////////
	async function insert() {
		const { data, error, success } = await superiorBase
			.from(TRANSACTIONS)
			.insert(transactions)
			.go<TransactionData[]>();

		return { data, error, success };
	}

	/////////////////////////
	async function rollback() {
		const { data, error, success } = await superiorBase
			.from(TRANSACTIONS)
			.delete()
			.in(
				'uid',
				transactions.map((m) => m.uid),
			)
			.go();
		return { data, error, success };
	}

	return {
		insert,
		rollback,
	};
}
