'use client';

import { useEffect, useMemo, useState } from 'react';
import useClientCookie from './useClientCookie';
import type { MonthlySumData } from '@/app/types';
import { MONTHLY_SUMS } from '@/app/constants';

interface UseMonthlySumDataProps {
	month: number;
	year: number;
}

export default function useMonthlySumData({
	month,
	year,
}: UseMonthlySumDataProps): {
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
		if (data !== null && !monthlySumsData) {
			setMonthlySumsData(data);

			if (month && year) {
				setMonthlySumData(
					data.find(({ month_uid_key }) => {
						const [m, y] = month_uid_key.split('-').map((m) => +m);

						return m === +month && y === year;
					}),
				);
			}
		}
	}, [data, month, monthlySumsData, year]);

	return { monthlySumData, monthlySumsData };
}
