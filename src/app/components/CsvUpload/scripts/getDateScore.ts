import type { Group } from '../../../types';
import { BIWEEKLY, MONTHLY, WEEKLY } from '..';

export default function getDateScore(group: Group) {
	const { prime, transactions } = group;

	if (transactions.length === 0) return false;

	const all = [prime, ...transactions];
	const matches = {
		[WEEKLY]: 0,
		[BIWEEKLY]: 0,
		[MONTHLY]: 0,
	};

	for (let i = 0; i < all.length; i++) {
		const current = all[i];
		const last = i === all.length - 1;
		const next = !last ? all[i + 1] : false;

		if (next) {
			const diff = current.timestamp.diff(next.timestamp, 'd');
			matches[WEEKLY] += 8 >= diff && diff >= 6 ? 1 : 0;
			matches[BIWEEKLY] += 16 >= diff && diff >= 12 ? 1 : 0;
			matches[MONTHLY] += 34 >= diff && diff >= 25 ? 1 : 0;
		}
	}

	const [maxInterval] = Object.entries(matches)
		.map(([name, count]) => ({ name, count }))
		.sort((a, b) => b.count - a.count);
	const checkRecurring = (threshold: number) =>
		Math.ceil((maxInterval.count / all.length) * 100) >= threshold
			? maxInterval.name
			: false;

	return {
		possiblyRecurring: checkRecurring(50),
		recurring: checkRecurring(75),
	};
}
