import { GROUPS, MONTHLY_SUMS } from '@/app/constants';
import type {
	GroupData,
	MonthlySumData,
	TransactionData,
	TransferData,
} from '@/app/types';
import { createMonthlySumPayload } from '@/app/types/MonthlySumData';
import { responseError } from '@/utils/api/responseFactory';
import type { SuperiorBase } from '@/utils/superiorBaseFactory';

interface MonthlySumsSetupArgs {
	group: GroupData;
	transfers: TransferData[] | null;
	transactions: TransactionData[];
	superiorBase: SuperiorBase;
}

export default function monthlySumsSetup({
	group,
	superiorBase,
	transactions,
	transfers,
}: MonthlySumsSetupArgs) {
	let payloadData: MonthlySumData[] | null = null;
	let snapshotData: MonthlySumData[] | null = null;

	/////////////////////////
	async function snapshot() {
		const { data, error, success } = await superiorBase
			.from(MONTHLY_SUMS)
			.select('*')
			.eq('user_uid', group.user_uid)
			.eq('account_uid', group.account_uid)
			.order('month_uid_key', { ascending: false })
			.go<MonthlySumData[]>();

		snapshotData = !error ? (data as MonthlySumData[]) : [];

		return { data, error, success };
	}

	/////////////////////////
	async function rollback() {
		if (payloadData === null)
			return {
				data: null,
				error: responseError({
					message: 'payloadData is null',
				}),
				success: null,
			};

		const { error: deleteError } = await superiorBase
			.from(MONTHLY_SUMS)
			.delete()
			.in(
				'uid',
				payloadData.map((m) => m.uid),
			)
			.go();

		if (deleteError) return { data: null, error: deleteError, success: null };

		const { data, error, success } = await superiorBase
			.from(MONTHLY_SUMS)
			.upsert(snapshot)
			.go();

		return { data, error, success };
	}

	/////////////////////////
	async function upsert() {
		const monthlySumPayload = createMonthlySumPayload({
			snapshot: snapshotData,
			transfers,
			transactions,
		});

		payloadData = monthlySumPayload ? monthlySumPayload : [];

		if (monthlySumPayload === null)
			return {
				data: null,
				error: responseError({
					message: 'createMonthlySumPayload returned null',
				}),
				success: null,
			};

		const { data, error, success } = await superiorBase
			.from(MONTHLY_SUMS)
			.upsert(monthlySumPayload, { onConflict: 'month_uid_key' })
			.go<MonthlySumData[]>();

		return { data, error, success };
	}

	//////
	return {
		rollback,
		snapshot,
		upsert,
	};
}
