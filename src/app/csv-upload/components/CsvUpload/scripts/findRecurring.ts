import type { GroupData } from '@/app/types';
import { BIWEEKLY, MONTHLY, WEEKLY } from '..';
import dayjs from 'dayjs';

const isBiWeekly = (diff: number) => (8 >= diff && diff >= 6 ? 1 : 0);
const isMonthly = (diff: number) => (16 >= diff && diff >= 12 ? 1 : 0);
const isWeekly = (diff: number) => (34 >= diff && diff >= 25 ? 1 : 0);

export default function findRecurring(group: GroupData) {
	const { prime, transactions } = group;

	if (transactions.length === 0) return false;

	const groupTransactions = [prime, ...transactions];
	const matches = {
		[WEEKLY]: 0,
		[BIWEEKLY]: 0,
		[MONTHLY]: 0,
	};

	for (let i = 0; i < groupTransactions.length; i++) {
		const current = groupTransactions[i];
		const isLast = i === groupTransactions.length - 1;
		const next = !isLast ? groupTransactions[i + 1] : false;

		if (next) {
			const diff = current.timestamp.diff(next.timestamp, 'd');
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
		Math.ceil((maxInterval.count / groupTransactions.length) * 100) >= threshold
			? maxInterval.name
			: false;

	const recurring = checkRecurring(51);
	const today = dayjs(new Date().getTime());
	const stillRecurring =
		recurring && today.diff(groupTransactions[0].timestamp, 'M') <= 1;

	return {
		recurring,
		count: groupTransactions.length,
		stillRecurring,
	};
}
