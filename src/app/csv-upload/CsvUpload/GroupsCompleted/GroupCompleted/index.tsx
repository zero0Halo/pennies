import type React from 'react';
import Badge from './Badge';
import Field from './Field';
import { useAccounts } from '@/app/hooks/client';
import type { GroupsData } from '@/app/types';
import { TRANSFER } from '@/app/constants';
import Transactions from '@/app/--playground--/Transactions';

interface GroupCompletedProps {
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

export default function GroupCompleted({
	groupsData: { group, transactions },
	index,
}: GroupCompletedProps) {
	const { getAccountByUid } = useAccounts();
	const alt: boolean = index % 2 !== 0;
	const categoryText =
		group.category !== TRANSFER
			? group.category
			: `${TRANSFER} to ${getAccountByUid(group.transfer_uid as string)?.name ?? ''}`;

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

			<div className="join join-horizontal mb-2 w-full">
				<Field
					alt={alt}
					className="join-item !mb-0 mr-1 w-1/2"
					label="Account"
					value={getAccountByUid(group.account_uid)?.name ?? ''}
				/>
				<Field
					alt={alt}
					className="join-item w-1/2"
					label="Category"
					value={categoryText}
				/>
			</div>
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
					<Transactions transactions={transactions} view="grouped" />
				</div>
			</div>
		</div>
	);
}
