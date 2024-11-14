import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Select from '@/app/components/Select';
import Label from '@/app/components/Label';
import Input from '@/app/components/Input';
import AlertMessages from './AlertMessages';
import ButtonGroup from './ButtonGroup';
import { apiCall } from '@/utils/app';
import useClientCookie from '@/app/hooks/useClientCookie';
import type { AccountDBData, ActiveRowData, UserData } from '@/app/types';
import { accountTypes, DELETE, EDIT, USER } from '@/app/constants';

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
		apiCall('/api/accounts/delete', {
			onError: (msg) => setError(msg),
			onSuccess: (msg) => setSuccess(msg),
			payload: {
				is_default: account.is_default,
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

		apiCall('/api/accounts/update', {
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
						<Label htmlFor="name">
							<Input type="text" {...register('name', { required: true })} />
						</Label>
					) : (
						account.name
					)}
				</td>

				<td>
					{isEditing ? (
						<Label htmlFor="type">
							<Select options={accountTypes} {...register('type')} />
						</Label>
					) : (
						account.type
					)}
				</td>

				<td className="text-center">
					{isEditing ? (
						<Label className="bg-transparent border-none" htmlFor="is_default">
							<Input
								defaultChecked={account.is_default}
								type="checkbox"
								{...register('is_default', { required: true })}
							/>
						</Label>
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
