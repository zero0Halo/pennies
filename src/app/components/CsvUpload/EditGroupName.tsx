import type React from 'react';
import { useForm } from 'react-hook-form';
import type { GroupData, SetEditingFn, SetGroupNameData } from '../../types';

export interface EditGroupNameProps {
	groupData: GroupData;
	setCSVData: React.Dispatch<React.SetStateAction<GroupData[]>>;
	setEditing: SetEditingFn;
}

export function EditGroupName({
	groupData,
	setEditing,
	setCSVData,
}: EditGroupNameProps) {
	const { register, handleSubmit, reset } = useForm<SetGroupNameData>();

	function handleSetGroupName({ name }: SetGroupNameData) {
		const { id } = groupData;

		setCSVData((state: GroupData[]) => {
			const entryIndex = state.findIndex((f: GroupData) => f.id === id);
			const newState = [...state];

			newState[entryIndex] = { ...newState[entryIndex], name };

			return newState;
		});

		reset();
		setEditing(false);
	}

	return (
		<form
			className="form-control join join-horizontal w-2/4"
			onSubmit={handleSubmit(handleSetGroupName)}
		>
			<input
				type="text"
				className="input input-sm input-bordered join-item w-3/4"
				placeholder={
					typeof groupData?.name === 'string' ? groupData.name : 'Group Name'
				}
				{...register('name', { required: true })}
			/>
			<button type="submit" className="btn btn-sm btn-accent join-item">
				Ok
			</button>
			<button
				type="button"
				className="btn btn-sm btn-warning join-item"
				onClick={() => {
					reset();
					setEditing(false);
				}}
			>
				Cancel
			</button>
			<button
				className="btn btn-error btn-sm text-white join-item"
				onClick={() => handleSetGroupName({ name: false })}
				type="button"
			>
				X
			</button>
		</form>
	);
}
