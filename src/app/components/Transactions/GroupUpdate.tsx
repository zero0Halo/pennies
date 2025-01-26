'use client';

import type { GroupData, TransactionData } from '@/app/types';
import type React from 'react';
import Button from '../Button';
import Label from '../Label';
import Input from '../Input';
import { useAccountsCookie } from '@/app/hooks/client';
import { TRANSFER } from '@/app/constants';
import { useForm } from 'react-hook-form';
import { apiCall } from '@/utils/app';
import { useFormMessagingContext } from '../FormMessaging';

interface GroupUpdateProps {
	group: GroupData | null;
	setActiveElement: () => void;
	transactions: TransactionData[] | null;
}

export default function GroupUpdate({
	group,
	setActiveElement,
	transactions,
}: GroupUpdateProps): React.ReactNode {
	if (group === null || transactions === null) return null;

	// CONTEXT
	const { setError, setSuccess } = useFormMessagingContext();

	// CUSTOM HOOKS
	const { getAccountByUid } = useAccountsCookie();
	const accountName = getAccountByUid(group.account_uid)?.name;
	const transferToAccountName = getAccountByUid(
		group?.to_account_uid ?? '',
	)?.name;

	// REACT FORM
	const { handleSubmit, register } = useForm<{
		notes?: string;
		siteurl?: string;
	}>({
		defaultValues: {
			notes: group.notes,
			siteurl: group.siteurl,
		},
	});

	// HANDLERS
	const handleGroupUpdate = async ({
		notes,
		siteurl,
	}: { notes?: string; siteurl?: string }): Promise<void> => {
		const payload = { ...group, notes, siteurl };

		const response = await apiCall<GroupData>('api/group/update', { payload });

		if (response.error) {
			console.error(response.data);
			setError('There was an error updating the group');
			return;
		}

		setSuccess('Successfully updated group!');
		setActiveElement();
	};

	return (
		<div className="bg-primary pt-1 p-8 rounded-lg relative">
			<h3 className="mt-4">Edit Group: {group.name}</h3>

			<form className="form-control" onSubmit={handleSubmit(handleGroupUpdate)}>
				<Label htmlFor="siteurl">
					Site Url
					<Input type="text" {...register('siteurl')} />
				</Label>

				<Label className="mb-4" htmlFor="notes">
					Notes
					<Input type="text" {...register('notes')} />
				</Label>

				<div className="join">
					<Button className="btn-warning join-item" onClick={setActiveElement}>
						Cancel
					</Button>
					<Button className="btn-success join-item" type="submit">
						Update
					</Button>
				</div>
			</form>
		</div>
	);
}
