import type { TransactionWithGroupData } from '@/app/types';
import type { ReactNode } from 'react';

interface TransactionNameProps {
	transaction: TransactionWithGroupData;
}

export default function TransactionName({
	transaction,
}: TransactionNameProps): ReactNode {
	const { description, name, group_name, group_siteurl } = transaction;
	const displayName = group_name ?? name ?? description;

	return group_siteurl ? (
		<a href={group_siteurl} rel="noreferrer" target="_blank">
			{displayName}
		</a>
	) : (
		<span>{displayName}</span>
	);
}
