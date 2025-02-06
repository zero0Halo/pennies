// THIS SHOULD WORK, BUT I'M PLAYING TOO FAST AND LOOSE WITH REACT STATE AND THE COMPILER IS LETTING
// ME KNOW THAT I SUCK

import type { GroupData, TransactionData, FindGroupsData } from '@/app/types';
import { apiCall } from '@/utils/app';
import { useEffect, useRef, useState } from 'react';

export default function useHashCheck(
	data: FindGroupsData | undefined,
): FindGroupsData | undefined {
	if (data === undefined) return;

	// STATE
	const [responseData, setResponseData] = useState<
		FindGroupsData | undefined
	>();

	// REF
	const mounted = useRef(false);

	// EFFECTS
	useEffect(() => {
		if (mounted?.current) return;

		async function fetchData() {
			if (data === undefined) return;
			try {
				const { groups, singletons, total } = data;
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
					return;
				}

				const updatedGroups = groups.map(({ group, transactions }) => {
					if (groupResults === null) return { group, transactions };
					const updatedGroup = (groupResults.data as GroupData[]).find(
						(f) => f.hash === group.hash,
					);
					return { transactions, group: updatedGroup ?? group };
				});

				setResponseData({
					groups: updatedGroups,
					singletons,
					total,
				});
			} catch (err) {
				console.error(err);
				return;
			}
		}

		fetchData();
		mounted.current = true;
	}, [data]);

	return responseData;
}
