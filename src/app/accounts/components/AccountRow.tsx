import type { AccountDBData } from '@/app/types';

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
	const rowClasses = editingRow
		? '!bg-blue-200'
		: account.is_default
			? '!bg-primary'
			: '';

	return (
		<tr className={rowClasses} key={account.uid}>
			<th>{index + 1}</th>

			<td>
				{!editingRow ? (
					account.name
				) : (
					<input
						type="text"
						className="input input-text input-sm input-bordered w-full"
					/>
				)}
			</td>

			<td>
				{!editingRow ? (
					account.type
				) : (
					<input
						type="text"
						className="input input-text input-sm input-bordered w-full"
					/>
				)}
			</td>

			<td className="text-center">
				{!editingRow ? (
					account.is_default && 'Yes'
				) : (
					<input
						type="checkbox"
						name="is_default"
						className="checkbox"
						defaultChecked={account.is_default}
					/>
				)}
			</td>

			<td className="text-right ">
				{!editingRow ? (
					<div className="join join-horizontal">
						<button
							className="btn btn-secondary btn-sm mr-1 join-item w-1/2"
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
							className="btn btn-success btn-sm mr-1 join-item w-1/2"
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
