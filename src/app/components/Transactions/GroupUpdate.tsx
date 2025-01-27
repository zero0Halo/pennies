'use client';

import type { GroupData, TransactionWithGroupData } from '@/app/types';
import type React from 'react';
import Button from '../Button';
import Label from '../Label';
import Input from '../Input';
import { useLoading } from '@/app/hooks/client';
import { useForm } from 'react-hook-form';
import { apiCall } from '@/utils/app';
import { useFormMessagingContext } from '../context/FormMessaging';
import Transactions from '.';

interface GroupUpdateProps {
	group: GroupData | null;
	setActiveElement: () => void;
	transactions: TransactionWithGroupData[] | null;
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
	const { Loading, props, setLoading } = useLoading();

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
		setLoading(true);

		const payload = { ...group, notes, siteurl };
		const response = await apiCall<GroupData>('api/group/update', { payload });

		setLoading(false, () => {
			if (response.error) {
				console.error(response.data);
				setError('There was an error updating the group');
				return;
			}

			setSuccess('Successfully updated group!');
			setActiveElement();
		});
	};

	return (
		<div className="bg-primary pt-1 p-8 rounded-lg relative">
			<Loading {...props} />

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

				<h4>This change will affect the following transactions:</h4>

				<Transactions
					className="mb-4"
					transactions={transactions}
					view="grouped"
				/>

				<div className="join flex justify-end">
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
