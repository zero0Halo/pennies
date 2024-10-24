import { useForm } from 'react-hook-form';
import type { AccountDBData } from '@/app/types';
import TypeSelect from './SelectType';

interface AccountRowProps {
	account: AccountDBData;
	editingRow: boolean | undefined;
	index: number;
	setEditingRow: (arg: number | undefined) => void;
}

export default function AccountRow({
	account,
	editingRow,
	setEditingRow,
	index,
}: AccountRowProps) {
	const {
		formState: { errors },
		register,
	} = useForm({
		defaultValues: {
			is_default: account.is_default,
			name: account.name,
			type: account.type,
		},
	});

	const zebraColor = index % 2 ? 'bg-slate-100' : 'bg-white';
	const rowClasses = editingRow
		? 'bg-accent'
		: account.is_default
			? '!bg-primary'
			: zebraColor;

	return (
		<tr className={rowClasses} key={account.uid}>
			<th>{index + 1}</th>

			<td>
				{!editingRow ? (
					account.name
				) : (
					<input
						className="input input-text input-sm input-bordered w-full border-black"
						type="text"
						{...register('type', { required: true })}
					/>
				)}
			</td>

			<td>
				{!editingRow ? (
					account.type
				) : (
					<TypeSelect
						className="w-full border-black"
						error={errors?.type}
						register={register}
					/>
				)}
			</td>

			<td className="text-center">
				{!editingRow ? (
					account.is_default && 'Yes'
				) : (
					<input
						className="checkbox border-black bg-white"
						defaultChecked={account.is_default}
						type="checkbox"
						{...register('is_default')}
					/>
				)}
			</td>

			<td className="text-right ">
				{!editingRow ? (
					<div className="join join-horizontal">
						<button
							className="btn btn-secondary btn-sm join-item w-1/2 mr-1"
							onClick={() => setEditingRow(index)}
							type="button"
						>
							Edit
						</button>
						<button
							className="btn btn-error btn-sm join-item w-1/2"
							type="button"
						>
							Delete
						</button>
					</div>
				) : (
					<div className="join join-horizontal">
						<button
							className="btn btn-success btn-sm mr-1 join-item w-1/2 text-white"
							onClick={() => setEditingRow(undefined)}
							type="button"
						>
							Save
						</button>
						<button
							className="btn btn-warning btn-sm join-item w-1/2"
							onClick={() => setEditingRow(undefined)}
							type="button"
						>
							Cancel
						</button>
					</div>
				)}
			</td>
		</tr>
	);
}
