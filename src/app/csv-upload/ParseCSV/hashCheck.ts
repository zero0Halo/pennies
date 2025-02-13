import type { ParseCSVData } from '@/app/types/ParseCSV';
import type { GroupData, TransactionData } from '@/app/types';
import { apiCall } from '@/utils/app';

export default async function hashCheck(
	data: ParseCSVData | undefined,
): Promise<ParseCSVData | false> {
	if (data === undefined) return false;

	try {
		const { groups, singletons, total } = data;
		if (!groups || !singletons) return false;

		const groupHashes = groups.map((m) => m.group.hash);
		const singletonsHashes = singletons.map((m) => m.hash);

		const [groupResults, singletonResults] = await Promise.all([
			apiCall<GroupData[]>('api/group/select', {
				payload: { hashes: groupHashes },
			}),
			apiCall<TransactionData[]>('api/transactions/select', {
				payload: { hashes: singletonsHashes },
			}),
		]);

		if (groupResults.data === null || singletonResults.data === null) {
			console.error('useHashCheck failed.', {
				groupResults,
				singletonResults,
			});
			return false;
		}

		const updatedGroups = groups.map(({ group, transactions }) => {
			if (groupResults === null) return { group, transactions };

			const updatedGroup = (groupResults.data as GroupData[]).find(
				(f) => f.hash === group.hash,
			);

			return { transactions, group: updatedGroup ?? group };
		});

		return {
			groups: updatedGroups,
			singletons,
			total,
		};
	} catch (err) {
		console.error(err);
		return false;
	}
}
