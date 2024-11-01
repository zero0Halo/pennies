import type React from 'react';
import { TransactionsTable } from '../TransactionsTable';
import type { FindGroupsData, GroupsData } from '@/app/types';
import CreateGroup from './CreateGroup';
import Button from '@/app/components/Button';

interface GroupProps {
	activeElement: number | undefined;
	index: number;
	groupData: GroupsData;
	setCSVData: React.Dispatch<React.SetStateAction<FindGroupsData | undefined>>;
	setActiveElement: React.Dispatch<React.SetStateAction<number | undefined>>;
}

export default function Group({
	activeElement,
	index,
	groupData: { group, transactions },
	setActiveElement,
	setCSVData,
}: GroupProps) {
	const isActive = activeElement === index;

	return (
		<div className="px-4">
			{isActive && (
				<CreateGroup
					group={group}
					setActiveElement={setActiveElement}
					transactions={transactions}
				/>
			)}
			{!isActive && (
				<>
					{!group?.name && (
						<Button
							className="btn-success"
							disabled={!!activeElement}
							onClick={() => setActiveElement(index)}
						>
							Create Group
						</Button>
					)}
					<h4 className="mb-0 mt-2 flex align-center">
						<span>{group.description}</span>

						<div className="badge badge-secondary ml-2 h-6 text-xs">
							{group.count}
						</div>

						{group.recurring && (
							<>
								<div className="badge badge-accent badge-sm ml-2 h-6">
									Recurring
								</div>
								<div className="badge badge-accent badge-sm ml-2 h-6">
									{group.recurring}
								</div>
								{group.still_recurring && (
									<div className="badge badge-accent badge-sm ml-2 h-6">
										Still Recurring
									</div>
								)}
							</>
						)}
					</h4>
					<div>
						({Array.isArray(group.terms) ? group.terms.join(', ') : group.terms}
						)
					</div>
					<TransactionsTable transactions={transactions} />
				</>
			)}

			<div className="divider" />
		</div>
	);
}
