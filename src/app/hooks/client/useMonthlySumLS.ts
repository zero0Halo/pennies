'use client';

import { useMemo } from 'react';
import storage from '@/utils/app/storage';
import type { MonthlySumData } from '@/app/types';
import { MONTHLY_SUMS } from '@/app/constants';

interface UseMonthlySumLSProps {
	month: number;
	year: number;
}

export default function useMonthlySumLS({
	month,
	year,
}: UseMonthlySumLSProps): {
	monthlySumData: MonthlySumData | undefined;
	monthlySumsData: MonthlySumData[] | undefined;
} {
	// UTIL
	const data = storage.get<MonthlySumData[] | string | boolean>({
		keyName: MONTHLY_SUMS,
	});

	// MEMO
	const monthlySumsData = useMemo(
		() => (Array.isArray(data) ? data : undefined),
		[data],
	);
	const monthlySumData = useMemo(() => {
		if (monthlySumsData) {
			return monthlySumsData.find(({ timestamp }) => {
				const date = new Date(timestamp);
				const m = date.getMonth();
				const y = date.getFullYear();

				return m === +month && y === year;
			});
		}
		return undefined;
	}, [month, monthlySumsData, year]);

	return { monthlySumData, monthlySumsData };
}
