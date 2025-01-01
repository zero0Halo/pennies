import type React from 'react';
import type { FindGroupsData, GroupsData } from '@/app/types';
import GroupCreate from './GroupCreate';
import Button from '@/app/components/Button';
import Transactions from '@/app/--playground--/Transactions';

interface GroupProps {
	activeElement: number | undefined;
	groupData: GroupsData;
	index: number;
	setActiveElement: React.Dispatch<React.SetStateAction<number | undefined>>;
	setCSVData: React.Dispatch<React.SetStateAction<FindGroupsData | undefined>>;
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
		<div className="p-4 bg-slate-100 rounded-xl mb-4">
			{isActive && (
				<GroupCreate
					group={group}
					setActiveElement={setActiveElement}
					setCSVData={setCSVData}
					transactions={transactions}
				/>
			)}
			{!isActive && (
				<>
					{!group?.name && (
						<Button
							className="btn-success"
							disabled={activeElement !== undefined}
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
					<Transactions
						tableClassName="border-white border-2"
						transactions={transactions}
						view="grouped"
					/>
				</>
			)}
		</div>
	);
}
