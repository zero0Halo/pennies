import type { ParseCSVData } from '@/app/csv-upload/CsvUpload/ParseCSV/types';
import type { GroupsData, TransactionData } from '@/app/types';
import { useEffect, useState } from 'react';

interface UseOrganizedCsvDataProps {
	CSVData: ParseCSVData | undefined;
}

type OrganizedTransactionsData = {
	groups: GroupsData[];
	singletons: TransactionData[];
};

type OrganizedCsvData = {
	completed: OrganizedTransactionsData;
	notCompleted: OrganizedTransactionsData;
};

export default function useOrganizedCsvData({
	CSVData,
}: UseOrganizedCsvDataProps): OrganizedCsvData {
	const [payload, setPayload] = useState<OrganizedCsvData>({
		completed: { groups: [], singletons: [] },
		notCompleted: { groups: [], singletons: [] },
	});

	useEffect(() => {
		if (CSVData !== undefined) {
			const { groups, singletons } = CSVData;
			if (groups === null || singletons === null) return;

			const completedGroups = groups.filter(
				({ group }) => group.name.length > 0,
			);
			const notCompletedGroups = groups.filter(
				({ group }) => !group.name.length,
			);
			const completedSingletons = singletons.filter(
				(singleton) => singleton.name.length,
			);
			const notCompletedSingletons = singletons.filter(
				(singleton) => !singleton.name.length,
			);

			setPayload({
				completed: { groups: completedGroups, singletons: completedSingletons },
				notCompleted: {
					groups: notCompletedGroups,
					singletons: notCompletedSingletons,
				},
			});
		}
	}, [CSVData]);

	return payload;
}
