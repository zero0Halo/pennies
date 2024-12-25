import type React from 'react';
import type { FindGroupsData, GroupsData } from '@/app/types';
import Group from '../Group';
import { useState } from 'react';

interface GroupsProps {
	className?: string;
	groupsData: GroupsData[] | undefined;
	setCSVData: React.Dispatch<React.SetStateAction<FindGroupsData | undefined>>;
}

export default function Groups({
	className,
	groupsData,
	setCSVData,
}: GroupsProps): React.ReactNode {
	if (groupsData === undefined) return null;

	// State
	const [activeElement, setActiveElement] = useState<number | undefined>();

	// JSX
	return (
		<div className={className}>
			{groupsData.map((groupData, index) => (
				<Group
					activeElement={activeElement}
					index={index}
					groupData={groupData}
					key={groupData.group.uid}
					setActiveElement={setActiveElement}
					setCSVData={setCSVData}
				/>
			))}
		</div>
	);
}
