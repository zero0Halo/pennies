'use client';

import { useEffect, useState } from 'react';
import useClientCookie from './useClientCookie';
import type { MonthlySumData } from '@/app/types';
import { MONTHLY_SUMS } from '@/app/constants';

interface UseMonthlySumDataCookieProps {
	month: number;
	year: number;
}

export default function useMonthlySumDataCookie({
	month,
	year,
}: UseMonthlySumDataCookieProps): {
	monthlySumData: MonthlySumData | undefined;
	monthlySumsData: MonthlySumData[] | undefined;
} {
	// CUSTOM HOOKS
	const { data } = useClientCookie<MonthlySumData[]>(MONTHLY_SUMS);

	// STATE
	const [monthlySumsData, setMonthlySumsData] = useState<
		MonthlySumData[] | undefined
	>();
	const [monthlySumData, setMonthlySumData] = useState<
		MonthlySumData | undefined
	>();

	// EFFECTS
	useEffect(() => {
		if (data !== null) {
			setMonthlySumsData(data);

			setMonthlySumData(
				data.find(({ timestamp }) => {
					console.log({ timestamp });
					const date = new Date(timestamp);
					const m = date.getMonth();
					const y = date.getFullYear();

					console.log({ m, month, y, year });
					return m === +month && y === year;
				}),
			);
		}
	}, [data, month, year]);

	return { monthlySumData, monthlySumsData };
}
