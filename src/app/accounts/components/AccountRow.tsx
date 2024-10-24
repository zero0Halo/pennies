import { useState } from 'react';
import { useForm } from 'react-hook-form';
import useClientCookie from '@/app/hooks/useClientCookie';
import type { AccountDBData, UserData } from '@/app/types';
import TypeSelect from './SelectType';
import { USER } from '@/app/constants';
import Messages from './Mesasages';

interface AccountRowProps {
	account: AccountDBData;
	editingRow: boolean;
	index: number;
	setEditingRow: (arg: number | false) => void;
}

export default function AccountRow({
	account,
	editingRow,
	setEditingRow,
	index,
}: AccountRowProps) {
	const [defaultWarning, setDefaultWarning] = useState(false);
	const [success, setSuccess] = useState('');
	const [error, setError] = useState('');
	const [userCookieData] = useClientCookie<UserData>(USER);

	const {
		formState: { errors, isDirty },
		getValues,
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

	async function handleUpdateAccount() {
		if (Object.keys(errors).length) return;
		if (!isDirty) setEditingRow(false);

		const is_default = getValues('is_default');
		const name = getValues('name');
		const type = getValues('type');

		if (is_default && !account.is_default && !defaultWarning) {
			setDefaultWarning(true);
			return;
		}

		const response = await fetch('/api/account-update', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				is_default,
				name,
				type,
				uid: account.uid,
				user_uid: (userCookieData as UserData).uid,
			}),
		});

		if (response.ok) {
			setSuccess('Account Updated Successfully. Refreshing...');
			setTimeout(() => {
				window.location.href = '/accounts';
			}, 2000);
		} else {
			const body = await response.json();
			setError(`${body.message}: ${body?.data?.message ?? ''}`);
		}
	}

	return (
		<>
			<tr className={rowClasses} key={account.uid}>
				<th>{index + 1}</th>

				<td>
					{!editingRow ? (
						account.name
					) : (
						<input
							className="input input-text input-sm input-bordered w-full border-black"
							type="text"
							{...register('name', { required: true })}
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
								onClick={handleUpdateAccount}
								type="button"
							>
								Submit
							</button>
							<button
								className="btn btn-warning btn-sm join-item w-1/2"
								onClick={() => setEditingRow(false)}
								type="button"
							>
								Cancel
							</button>
						</div>
					)}
				</td>
			</tr>
			{editingRow && (defaultWarning || success || error) && (
				<tr className={rowClasses}>
					<td colSpan={5}>
						<Messages
							defaultWarning={defaultWarning}
							error={error}
							success={success}
						/>
					</td>
				</tr>
			)}
		</>
	);
}
