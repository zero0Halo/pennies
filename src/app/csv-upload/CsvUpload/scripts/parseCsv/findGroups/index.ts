import { v4 as uuidv4 } from 'uuid';
import clone from './clone';
import getDescriptionScore from './getDescriptionScore';
import type {
	FindGroupsData,
	TransactionData,
	GroupData,
	GroupsData,
} from '@/app/types';

export default function findGroups(rowData: TransactionData[]): FindGroupsData {
	const groups: GroupsData[] = [];
	const singletons: TransactionData[] = [];
	let transactionsPool: TransactionData[] = rowData.map(
		(row) => clone(row) as TransactionData,
	);

	// Continually remove the first item from the pool so the choices to match against get smaller
	while (transactionsPool.length) {
		const transaction = transactionsPool.shift() as TransactionData;
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
				account_uid: transaction.account_uid,
				category: '',
				count: matches.length + 1,
				created: '',
				description: transaction.description,
				name: false,
				notes: '',
				prime: transaction.uid,
				recurring: false,
				siteurl: '',
				still_recurring: false,
				terms: transaction.terms,
				uid: groupUid,
				updated: '',
				user_uid: transaction.user_uid,
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
	}

	return { groups, singletons, total: 0 };
}
