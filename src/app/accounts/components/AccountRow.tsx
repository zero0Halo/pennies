import { useState } from 'react';
import { useForm } from 'react-hook-form';
import useClientCookie from '@/app/hooks/useClientCookie';
import type { AccountDBData, ActiveRowData, UserData } from '@/app/types';
import { DELETE, EDIT, USER } from '@/app/constants';
import AlertMessages from './AlertMessages';
import TypeSelect from './SelectType';
import ButtonGroup from './ButtonGroup';
import apiCall from '../scripts/apiCall';

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

	async function handleSubmitDelete() {
		apiCall('/api/account-delete', {
			onError: (msg) => setError(msg),
			onSuccess: (msg) => setSuccess(msg),
			payload: {
				uid: account.uid,
				user_uid: (userCookieData as UserData).uid,
			},
			reload: '/accounts',
		});
	}

	async function handleSubmitEdit() {
		if (Object.keys(errors).length) return;
		if (!isDirty) {
			setActiveRow({ mode: false, index: false });
			return;
		}
		const is_default = getValues('is_default');
		const name = getValues('name');
		const type = getValues('type');

		if (is_default && !account.is_default && !defaultWarning) {
			setDefaultWarning(true);
			return;
		}

		apiCall('/api/account-update', {
			onError: (msg) => setError(msg),
			onSuccess: (msg) => setSuccess(msg),
			payload: {
				is_default,
				name,
				type,
				uid: account.uid,
				user_uid: (userCookieData as UserData).uid,
			},
			reload: '/accounts',
		});
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
						handleSubmitDelete={handleSubmitDelete}
						handleSubmitEdit={handleSubmitEdit}
					/>
				</td>
			</tr>

			{(isEditing || isDeleting) &&
				(defaultWarning || success || error || isDeleting) && (
					<tr className={rowClasses}>
						<td colSpan={5}>
							<AlertMessages
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
