import type React from 'react';
import GroupCompleted from './GroupCompleted';
import type { GroupsData } from '@/app/types';

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

	// JSX
	return (
		<div className={className}>
			{title && <h3>{title}</h3>}

			{groupsData.map((groupData, index) => (
				<GroupCompleted
					groupsData={groupData}
					index={index}
					key={groupData.group.uid}
				/>
			))}
		</div>
	);
}
