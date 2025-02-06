import GroupCreate from '@/app/components/Groups/GroupCreate';
import type { FindGroupsData, GroupsData } from '@/app/types';
import type React from 'react';
import Button from '../../Button';
import Transactions from '../../Transactions';
import type { ParseCSVData } from '@/app/csv-upload/CsvUpload/ParseCSV/types';

interface GroupsStandardProps {
	activeElement?: number | boolean;
	className?: string;
	groupsData: GroupsData[] | undefined;
	setActiveElement?: (arg: number | boolean) => void;
	setCSVData?: React.Dispatch<React.SetStateAction<ParseCSVData | undefined>>;
	title?: string;
}

export default function GroupsStandard({
	activeElement,
	className,
	groupsData,
	setActiveElement,
	setCSVData,
	title,
}: GroupsStandardProps): React.ReactNode {
	if (
		groupsData === undefined ||
		setCSVData === undefined ||
		setActiveElement === undefined
	)
		return null;

	return (
		<div className={className}>
			{title && <h3>{title}</h3>}

			{groupsData.map(({ group, transactions }, index) => (
				<div className="p-4 bg-slate-100 rounded-xl mb-4" key={group.hash}>
					{index === activeElement && (
						<GroupCreate
							group={group}
							setActiveElement={setActiveElement}
							setCSVData={setCSVData}
							transactions={transactions}
						/>
					)}
					{index !== activeElement && (
						<>
							{!group?.name && (
								<Button
									className="btn-success"
									disabled={activeElement !== false}
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
											{group.recurring_type}
										</div>
										{group.recurring_still && (
											<div className="badge badge-accent badge-sm ml-2 h-6">
												Still Recurring
											</div>
										)}
									</>
								)}
							</h4>
							<div>
								(
								{Array.isArray(group.terms)
									? group.terms.join(', ')
									: group.terms}
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
			))}
		</div>
	);
}
