import type React from 'react';
import { useForm } from 'react-hook-form';
import type {
	FindGroupsData,
	GroupData,
	SetEditingFn,
	SetGroupNameData,
} from '@/app/types';

export interface EditGroupNameProps {
	group: GroupData;
	setCSVData: React.Dispatch<React.SetStateAction<FindGroupsData | undefined>>;
	setEditing: SetEditingFn;
}

export function EditGroupName({
	group,
	setEditing,
	setCSVData,
}: EditGroupNameProps) {
	const { register, handleSubmit, reset } = useForm<SetGroupNameData>();

	function handleSetGroupName({ name }: SetGroupNameData) {
		const { uid } = group;

		setCSVData((state) => {
			if (state) {
				const { groups } = state;
				const groupEntryIndex = groups.findIndex(
					({ group }) => group.uid === uid,
				);
				const newState = {
					groups: [...state.groups],
					singletons: [...state.singletons],
					total: state.total,
				};
				const newGroup = groups[groupEntryIndex].group;
				const newTransactions = groups[groupEntryIndex].transactions;
				newGroup.name = name;

				newState.groups.splice(groupEntryIndex, 1, {
					group: newGroup,
					transactions: newTransactions,
				});

				return newState;
			}

			return undefined;
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
					typeof group?.name === 'string' ? group.name : 'Group Name'
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
