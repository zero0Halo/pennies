import { GROUPS, TRANSFERS } from '@/app/constants';
import type { GroupData, TransferData } from '@/app/types';
import { responseError, responseSuccess } from '@/utils/api/responseFactory';
import type { SuperiorBase } from '@/utils/superiorBaseFactory';

export default function transfersSetup({
	transfers,
	superiorBase,
}: { transfers: TransferData[]; superiorBase: SuperiorBase }) {
	///////////////////////
	async function insert() {
		if (!transfers)
			return {
				data: null,
				error: null,
				success: responseSuccess({
					message: 'There are no transfers to insert',
				}),
			};

		const { data, error, success } = await superiorBase
			.from(TRANSFERS)
			.insert(transfers)
			.go();

		return { data, error, success };
	}

	/////////////////////////
	async function rollback() {
		if (!transfers)
			return {
				data: null,
				error: null,
				success: responseSuccess({
					message: 'There are no transfers to rollback',
				}),
			};

		const { data, error, success } = await superiorBase
			.from(TRANSFERS)
			.delete()
			.in(
				'uid',
				transfers.map((m) => m.uid),
			)
			.go();
		return { data, error, success };
	}

	return {
		insert,
		rollback,
	};
}
