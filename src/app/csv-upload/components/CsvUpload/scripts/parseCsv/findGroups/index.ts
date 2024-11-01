import { v4 as uuidv4 } from 'uuid';
import clone from './clone';
import getDescriptionScore from './getDescriptionScore';
import type {
	FindGroupsData,
	FormattedRowData,
	GroupData,
	GroupsData,
} from '@/app/types';

export default function findGroups(
	rowData: FormattedRowData[],
): FindGroupsData {
	const groups: GroupsData[] = [];
	const singletons: FormattedRowData[] = [];
	let transactionsPool: FormattedRowData[] = rowData.map(
		(row) => clone(row) as FormattedRowData,
	);

	// Continually remove the first item from the pool so the choices to match against get smaller
	while (transactionsPool.length) {
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
				category: '',
				count: matches.length + 1,
				created: '',
				description: transaction.description,
				name: '',
				notes: '',
				prime: transaction.uid,
				recurring: false,
				siteurl: '',
				still_recurring: false,
				terms: transaction.terms,
				uid: groupUid,
				updated: '',
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
