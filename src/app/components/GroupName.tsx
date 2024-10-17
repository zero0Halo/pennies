import { useForm } from 'react-hook-form';
import type { GroupData, GroupNameProps } from '../types';

interface SetGroupNameData {
	name: string;
}

export function GroupName({ data, setEditing, setCSVData }: GroupNameProps) {
	const { register, handleSubmit, reset } = useForm<SetGroupNameData>();

	function handleSetGroupName({ name }: SetGroupNameData) {
		const { id } = data;

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
				placeholder="Group Name"
				{...register('name', { required: true })}
			/>
			<button type="submit" className="btn btn-sm btn-accent join-item">
				Ok
			</button>
			<button
				type="button"
				className="btn btn-sm btn-error join-item"
				onClick={() => {
					reset();
					setEditing(false);
				}}
			>
				Cancel
			</button>
		</form>
	);
}
