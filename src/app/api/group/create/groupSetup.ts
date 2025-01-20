import { GROUPS } from '@/app/constants';
import type { GroupData } from '@/app/types';
import { responseError } from '@/utils/api/responseFactory';
import type { SuperiorBase } from '@/utils/superiorBaseFactory';

export default function groupSetup({
	group,
	superiorBase,
}: { group: GroupData; superiorBase: SuperiorBase }) {
	////////////////////////////
	async function uniqueCheck() {
		const { data, error, success } = await superiorBase
			.from(GROUPS)
			.select('*')
			.eq('hash', group.hash)
			.eq('user_uid', group.user_uid)
			.eq('account_uid', group.account_uid)
			.successMessage("Can't create Group. Existing Hash")
			.go<GroupData>();
		const notUnique = Array.isArray(data) && data.length > 0;

		return {
			data,
			error: notUnique
				? responseError({
						message: "Can't create Group. Existing Hash",
						data,
					})
				: error,
			success,
		};
	}

	///////////////////////
	async function insert() {
		const { data, error, success } = await superiorBase
			.from(GROUPS)
			.insert({ ...group })
			.go();

		return { data, error, success };
	}

	/////////////////////////
	async function rollback() {
		const { data, error, success } = await superiorBase
			.from(GROUPS)
			.delete()
			.eq('uid', group.uid)
			.eq('user_uid', group.user_uid)
			.go();
		return { data, error, success };
	}

	return {
		insert,
		rollback,
		uniqueCheck,
	};
}
