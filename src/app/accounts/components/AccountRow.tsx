import type { AccountDBData } from '@/app/types';
import { useState } from 'react';

interface AccountRowProps {
	account: AccountDBData;
	index: number;
}

export default function AccountRow({ account, index }: AccountRowProps) {
	const [editing, setEditing] = useState(false);

	return (
		<tr className={account.is_default ? '!bg-primary' : ''} key={account.uid}>
			<th>{index + 1}</th>

			<td>
				{!editing ? (
					account.name
				) : (
					<input
						type="text"
						className="input input-text input-sm input-bordered w-full"
					/>
				)}
			</td>

			<td>
				{!editing ? (
					account.type
				) : (
					<input
						type="text"
						className="input input-text input-sm input-bordered w-full"
					/>
				)}
			</td>

			<td className="text-center">
				{!editing ? (
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

			<td className="text-right">
				{!editing ? (
					<>
						<button
							className="btn btn-secondary btn-sm mr-2"
							onClick={() => setEditing(true)}
							type="button"
						>
							Edit
						</button>
						<button className="btn btn-error btn-sm mr-2" type="button">
							Delete
						</button>
					</>
				) : (
					<>
						<button
							className="btn btn-success btn-sm mr-2 text-white"
							onClick={() => setEditing(false)}
							type="button"
						>
							Save
						</button>
						<button
							className="btn btn-warning btn-sm mr-2"
							onClick={() => setEditing(false)}
							type="button"
						>
							Cancel
						</button>
					</>
				)}
			</td>
		</tr>
	);
}
