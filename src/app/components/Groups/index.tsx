'use client';

import type React from 'react';
import classNames from 'classnames';
import type { FindGroupsData, GroupsData } from '@/app/types';
import GroupsStandard from './views/GroupsStandard';
import GroupsCompleted from './views/GroupsCompleted';
import { useEffect, useState } from 'react';

const GROUPS_COMPLETE = 'groupsComplete';
const STANDARD = 'standard';

type Views = typeof GROUPS_COMPLETE | typeof STANDARD;

interface GroupsProps {
	activeElement?: number | boolean;
	className?: string;
	setActiveElement?: (arg: number | boolean) => void;
	setCSVData?: React.Dispatch<React.SetStateAction<FindGroupsData | undefined>>;
	title?: string;
	groupsData: GroupsData[];
	view?: Views;
}

// COMPONENT
export default function Groups({
	activeElement,
	className,
	setActiveElement,
	setCSVData,
	title,
	groupsData,
	view = STANDARD,
}: GroupsProps): React.ReactNode {
	if (!groupsData.length) return null;

	// STATE
	const [internalActiveElement, setInternalActiveElement] = useState<
		number | boolean
	>(activeElement ?? false);

	// EFFECTS
	useEffect(() => {
		if (activeElement !== undefined) {
			setInternalActiveElement(activeElement);
		}
	}, [activeElement]);

	// SHUGAH
	const componentClasses = classNames('relative z-0', className);
	const props = {
		activeElement: internalActiveElement,
		setActiveElement: setActiveElement ?? setInternalActiveElement,
	};

	// JSX
	return (
		<div className={componentClasses}>
			{title && <h3 className="mt-3">{title}</h3>}

			{groupsData.length > 0 &&
				(() => {
					switch (view) {
						case GROUPS_COMPLETE:
							return <GroupsCompleted groupsData={groupsData} {...props} />;
						case STANDARD:
							return (
								<GroupsStandard
									groupsData={groupsData}
									setCSVData={setCSVData}
									{...props}
								/>
							);
						default:
							null;
					}
				})()}

			{groupsData.length === 0 && <h5>None</h5>}
		</div>
	);
}
