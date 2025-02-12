import useAccountsCookie from '@/app/hooks/useAccountsCookie/client';
import type { GroupData, GroupsData } from '@/app/types';
import type React from 'react';
import { getCategoryText as _getCategoryText } from '../helpers';
import InputStatic from '../../InputStatic';
import Transactions from '../../Transactions';

interface GroupsCompletedProps {
	className?: string;
	groupsData: GroupsData[] | undefined;
	title?: string;
}

export default function GroupsCompleted({
	className,
	groupsData,
	title,
}: GroupsCompletedProps): React.ReactNode {
	if (groupsData === undefined) return null;

	// CUSTOM HOOKS
	const { getAccountByUid } = useAccountsCookie();

	// SHUGAH
	const getCategoryText = (val: GroupData) =>
		_getCategoryText(val, getAccountByUid);

	return (
		<div className={className}>
			{title && <h3>{title}</h3>}

			{groupsData.map(({ group, transactions }) => (
				<div
					className="border-2 rounded-lg px-4 pt-4 pb-1 mb-4 bg-slate-100 border-slate-200"
					key={group.hash}
				>
					<div className="flex items-center border-b-2 pb-2 mb-2">
						<h3 className="p-0 m-0">{group.name}</h3>

						{group.recurring && (
							<div className="ml-auto">
								<div className="badge bg-white badge-sm ml-2 h-6 border-slate-200 border-2">
									Recurring
								</div>
								<div className="badge bg-white badge-sm ml-2 h-6 border-slate-200 border-2">
									{group.recurring_type}
								</div>

								{group.recurring_autopay && (
									<div className="badge bg-white badge-sm ml-2 h-6 border-slate-200 border-2">
										Autopay
									</div>
								)}

								{group.recurring_still && (
									<div className="badge bg-white badge-sm ml-2 h-6 border-slate-200 border-2">
										Still Recurring
									</div>
								)}
							</div>
						)}
					</div>

					<InputStatic label="Description" value={group.description} />

					<div className="join join-horizontal mb-2 w-full">
						<InputStatic
							className="join-item !mb-0 mr-1 w-1/2"
							label="Account"
							value={getAccountByUid?.(group.account_uid)?.name ?? ''}
						/>
						<InputStatic
							className="join-item w-1/2"
							label="Category"
							value={getCategoryText(group)}
						/>
					</div>
					<InputStatic label="Terms" value={group.terms} />
					<InputStatic label="Site Url" value={group.siteurl ?? ''} />
					<InputStatic label="Notes" value={group.notes ?? ''} />

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
			))}
		</div>
	);
}
