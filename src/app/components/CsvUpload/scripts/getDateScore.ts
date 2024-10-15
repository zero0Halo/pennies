import type { Dayjs } from 'dayjs';
import type { FormattedDataProps } from '../types';

export default function getDateScore(
	mapValue: FormattedDataProps[],
	timestamp: Dayjs,
) {
	const { timestamp: lastTimestamp } = mapValue.at(mapValue.length - 1) ?? {};

	if (lastTimestamp && timestamp) {
		const difference = lastTimestamp.diff(timestamp, 'd');
		const weekly = 8 >= difference && difference >= 6;
		const biWeekly = 15 >= difference && difference >= 13;
		const monthly = 31 >= difference && difference >= 28;
		const none = !weekly && !biWeekly && !monthly;

		return { weekly, biWeekly, monthly, none };
	}

	return { none: true };
}
