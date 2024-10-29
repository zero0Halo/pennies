import { v4 as uuidv4 } from 'uuid';
import clone from './clone';
import getDescriptionScore from './getDescriptionScore';
import type {
	FindGroupData,
	FormattedRowData,
	GroupData,
	GroupsData,
} from '@/app/types';

export default function findGroups(rowData: FormattedRowData[]): FindGroupData {
	const groups: GroupsData[] = [];
	const singletons: FormattedRowData[] = [];
	let transactionsPool: FormattedRowData[] = rowData.map(
		(row) => clone(row) as FormattedRowData,
	);

	// Continually remove the first item from the pool so the choices to match against get smaller
	while (transactionsPool.length) {
		console.log(
			'start',
			transactionsPool.length,
			rowData.length - transactionsPool.length,
		);
		const transaction = transactionsPool.shift() as FormattedRowData;
		let matches = transactionsPool.filter(
			(f) => getDescriptionScore(transaction.terms, f.terms) > 75,
		);
		const uids = matches.map(({ uid }) => uid);
		uids.push(transaction.uid);

		transactionsPool = transactionsPool.filter(
			({ uid }) => !uids.includes(uid),
		);

		if (matches.length) {
			const groupUid = uuidv4();
			const group: GroupData = {
				count: matches.length + 1,
				description: transaction.description,
				name: '',
				prime: transaction.uid,
				recurring: false,
				stillRecurring: false,
				uid: groupUid,
			};

			transaction.prime = true;
			transaction.group_uid = groupUid;

			matches = matches.map((match) => {
				match.prime = false;
				match.group_uid = groupUid;
				return match;
			});
			groups.push({ group, transactions: [transaction, ...matches] });
		} else {
			singletons.push(transaction);
		}

		console.log('end', transactionsPool.length, '\n\n');
	}

	let count = 0;
	groups.map(({ transactions }) => {
		count += transactions.length;
	});
	console.log(count + singletons.length);

	return { groups, singletons };
}
