import type React from 'react';
import type { GroupsData } from '@/app/types';
import Badge from './Badge';
import Field from './Field';
import { TransactionsTable } from '../../TransactionsTable';

interface CompletedGroupProps {
	groupsData: GroupsData;
	index: number;
}

function classes(alt: boolean) {
	const classes: string | string[] = [
		'border-2 rounded-lg px-4 pt-4 pb-1 mb-4',
	];
	classes.push(alt ? 'bg-white border-slate-100' : 'bg-slate-100 border-white');
	return classes.join(' ');
}

export default function CompletedGroup({
	groupsData: { group, transactions },
	index,
}: CompletedGroupProps) {
	const alt: boolean = index % 2 !== 0;

	return (
		<div className={classes(alt)}>
			<div className="flex items-center border-b-2 pb-2 mb-2">
				<h3 className="p-0 m-0">{group.name}</h3>

				{group.recurring && (
					<div className="ml-auto">
						<Badge alt={alt} label="Recurring" />
						<Badge alt={alt} label={group.recurring} />
						{group.still_recurring && (
							<Badge alt={alt} label="Still Recurring" />
						)}
					</div>
				)}
			</div>

			<Field alt={alt} label="Description" value={group.description} />
			<Field alt={alt} label="Category" value={group.category} />
			<Field alt={alt} label="Terms" value={group.terms} />
			<Field alt={alt} label="Site Url" value={group.siteurl} />
			<Field alt={alt} label="Notes" value={group.notes} />

			<div
				// biome-ignore lint/a11y/noNoninteractiveTabindex: <explanation>
				tabIndex={0}
				className="collapse collapse-plus border-base-300 bg-accent mt-2 mb-4 rounded-xl overflow-hidden border"
			>
				<div className="collapse-title text-md font-bold">
					<div className="flex items-center">
						Transactions
						<span className="badge badge-sm ml-2">{group.count}</span>{' '}
					</div>
				</div>
				<div className="collapse-content">
					<TransactionsTable transactions={transactions} />
				</div>
			</div>
		</div>
	);
}
