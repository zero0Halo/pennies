import { useForm } from 'react-hook-form';
import type { GroupNameProps } from '../types';

export function GroupName({ data, setEditing }: GroupNameProps) {
	const { register, handleSubmit, reset } = useForm();

	function handleSetGroupName() {
		reset();
		setEditing(false);
	}

	console.log(data);

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
