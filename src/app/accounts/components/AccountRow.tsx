import { useState } from 'react';
import { useForm } from 'react-hook-form';
import useClientCookie from '@/app/hooks/useClientCookie';
import type { AccountDBData, ActiveRowData, UserData } from '@/app/types';
import { DELETE, EDIT, USER } from '@/app/constants';
import Messages from './Mesasages';
import TypeSelect from './SelectType';
import ButtonGroup from './ButtonGroup';

interface AccountRowProps {
	account: AccountDBData;
	index: number;
	isEditing: boolean;
	isDeleting: boolean;
	setActiveRow: (arg: ActiveRowData) => void;
}

export default function AccountRow({
	account,
	index,
	isEditing,
	isDeleting,
	setActiveRow,
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
	const rowClasses =
		isEditing || isDeleting
			? 'bg-accent'
			: account.is_default
				? '!bg-primary'
				: zebraColor;

	async function handleSubmitEdit() {
		if (Object.keys(errors).length) return;
		if (!isDirty) setActiveRow({ mode: false, index: false });

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
					{isEditing ? (
						<input
							className="input input-text input-sm input-bordered w-full border-black"
							type="text"
							{...register('name', { required: true })}
						/>
					) : (
						account.name
					)}
				</td>

				<td>
					{isEditing ? (
						<TypeSelect
							className="w-full border-black"
							error={errors?.type}
							register={register}
						/>
					) : (
						account.type
					)}
				</td>

				<td className="text-center">
					{isEditing ? (
						<input
							className="checkbox border-black bg-white"
							defaultChecked={account.is_default}
							type="checkbox"
							{...register('is_default')}
						/>
					) : (
						account.is_default && 'Yes'
					)}
				</td>

				<td className="text-right ">
					<ButtonGroup
						isDeleting={isDeleting}
						isEditing={isEditing}
						handleCancel={() => setActiveRow({ mode: false, index: false })}
						handleDelete={() => setActiveRow({ mode: DELETE, index })}
						handleEdit={() => setActiveRow({ mode: EDIT, index })}
						handleSubmitDelete={() => {}}
						handleSubmitEdit={handleSubmitEdit}
					/>
				</td>
			</tr>

			{(isEditing || isDeleting) &&
				(defaultWarning || success || error || isDeleting) && (
					<tr className={rowClasses}>
						<td colSpan={5}>
							<Messages
								defaultWarning={defaultWarning}
								error={error}
								isDeleting={isDeleting}
								success={success}
							/>
						</td>
					</tr>
				)}
		</>
	);
}
