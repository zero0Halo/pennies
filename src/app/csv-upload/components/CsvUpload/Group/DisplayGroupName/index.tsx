import type React from 'react';
import { useState } from 'react';
import { EditGroupName } from './EditGroupName';
import type { FindGroupsData, GroupData } from '@/app/types';

interface DisplayGroupNameProps {
	group: GroupData;
	setCSVData: React.Dispatch<React.SetStateAction<FindGroupsData | undefined>>;
}

export default function DisplayGroupName({
	group,
	setCSVData,
}: DisplayGroupNameProps) {
	const [editing, setEditing] = useState(false);

	return (
		<div className="h-8">
			{!group.name && !editing && (
				<button
					className="btn btn-ghost btn-sm text-gray-300 text-xl hover:text-gray-900 mb-0"
					onClick={() => setEditing(true)}
					type="button"
				>
					Click here to name this Group
				</button>
			)}

			{editing && (
				<EditGroupName
					group={group}
					setCSVData={setCSVData}
					setEditing={setEditing}
				/>
			)}

			{group.name && !editing && (
				<div className="flex items-center">
					<h3 className="my-0 mr-2">{group.name}</h3>
					<button
						className="btn btn-primary btn-xs mr-1"
						onClick={() => setEditing(true)}
						type="button"
					>
						Edit
					</button>
				</div>
			)}
		</div>
	);
}
