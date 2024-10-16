// import dayjs, { type Dayjs } from 'dayjs';
import type { FindGroupsProps } from '../types';

export default function getDateScore(group: FindGroupsProps) {
	const { prime, transactions } = group;

	if (transactions.length === 0) return false;

	const all = [prime, ...transactions];
	let matches = 0;

	for (let i = 0; i < all.length; i++) {
		const current = all[i];
		const last = i === all.length - 1;
		const next = !last ? all[i + 1] : false;

		if (!last && next) {
			const diff = current.timestamp.diff(next.timestamp, 'd');
			const weekly = 8 >= diff && diff >= 6;
			const biweekly = 16 >= diff && diff >= 12;
			const monthly = 34 >= diff && diff >= 25;
			const none = !weekly && !biweekly && !monthly;
			if (!none) matches++;
		}
	}

	return Math.ceil((matches / transactions.length) * 100) >= 75;

	// const { timestamp: primeTimestamp } = prime;

	// const interval = transactions.reduce<Dayjs | number | boolean>(
	// 	(acc, { timestamp }, index) => {
	// 		if (dayjs.isDayjs(acc)) {
	// 			const diff = acc.diff(timestamp, 'd');
	// 			const weekly = 8 >= diff && diff >= 6;
	// 			const biweekly = 16 >= diff && diff >= 12;
	// 			const monthly = 34 >= diff && diff >= 25;
	// 			const none = !weekly && !biweekly && !monthly;
	// 			const last = index === transactions.length - 1;
	// 			if (!none && last) return diff;
	// 			if (!none) return timestamp;
	// 			if (none) return false;
	// 		}
	// 		return false;
	// 	},
	// 	primeTimestamp,
	// );

	// if (!interval) {
	// 	console.log(group.description);
	// 	console.log(group.transactions.length, group);
	// 	console.log(interval);
	// 	console.log('\n');
	// }

	// return interval;
}
