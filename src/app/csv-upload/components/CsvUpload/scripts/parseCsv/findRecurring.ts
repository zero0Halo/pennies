import type { FormattedRowData } from '@/app/types';
import { BIWEEKLY, MONTHLY, WEEKLY } from '@/app/constants';
import dayjs from 'dayjs';

const isBiWeekly = (diff: number) => (8 >= diff && diff >= 6 ? 1 : 0);
const isMonthly = (diff: number) => (16 >= diff && diff >= 12 ? 1 : 0);
const isWeekly = (diff: number) => (34 >= diff && diff >= 25 ? 1 : 0);

export default function findRecurring(transactions: FormattedRowData[]) {
	if (transactions.length === 0) return false;

	const matches = {
		[WEEKLY]: 0,
		[BIWEEKLY]: 0,
		[MONTHLY]: 0,
	};

	for (let i = 0; i < transactions.length; i++) {
		const current = transactions[i];
		const isLast = i === transactions.length - 1;
		const next = !isLast ? transactions[i + 1] : false;

		if (next) {
			const diff = dayjs(current.timestamp).diff(dayjs(next.timestamp), 'd');
			matches[WEEKLY] += isWeekly(diff);
			matches[BIWEEKLY] += isBiWeekly(diff);
			matches[MONTHLY] += isMonthly(diff);
		}
	}

	// Get the interval with the highest score.
	const [maxInterval] = Object.entries(matches)
		.map(([name, count]) => ({ name, count }))
		.sort((a, b) => b.count - a.count);

	// Returns the name of the interval if the percentage of matches meets the passed threshold.
	const checkRecurring = (threshold: number) =>
		Math.ceil((maxInterval.count / transactions.length) * 100) >= threshold
			? maxInterval.name
			: false;

	const recurring = checkRecurring(51);
	const today = dayjs(new Date().getTime());
	const still_recurring =
		recurring && today.diff(transactions[0].timestamp, 'M') <= 1;

	return {
		recurring,
		still_recurring,
	};
}
