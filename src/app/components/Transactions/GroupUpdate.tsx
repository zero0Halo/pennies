'use client';

import type {
	GroupData,
	TransactionWithDateData,
	TransactionWithGroupData,
} from '@/app/types';
import type React from 'react';
import Button from '../Button';
import Label from '../Label';
import Input from '../Input';
import { useLoading } from '@/app/hooks/client';
import { useForm } from 'react-hook-form';
import { apiCall } from '@/utils/app';
import { useFormMessagingContext } from '../context/FormMessaging';
import Transactions from '.';
import { useTransactionsMonthContext } from '../context/TransactionsMonth';

interface GroupUpdateProps {
	group: GroupData | null;
	handleReset: () => void;
	setActiveElement: () => void;
	transaction: TransactionWithGroupData | null;
	transactions: TransactionWithGroupData[] | null;
}

export default function GroupUpdate({
	group,
	handleReset,
	setActiveElement,
	transaction,
	transactions,
}: GroupUpdateProps): React.ReactNode {
	if (group === null || transactions === null) return null;

	// CONTEXT
	const { setError, setSuccess } = useFormMessagingContext();
	const { setTransactions } = useTransactionsMonthContext();

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

		const updatePayload = { ...group, notes, siteurl };
		const selectPayload = {
			account_uid: transaction?.account_uid,
			date: transaction?.timestamp,
		};
		const updateResponse = await apiCall<GroupData>('api/group/update', {
			payload: updatePayload,
		});
		const selectResponse = await apiCall<TransactionWithDateData[]>(
			'api/transactions/select/by-day',
			{ payload: selectPayload },
		);

		setLoading(false, () => {
			if (updateResponse.error) {
				console.error(updateResponse.data);
				setError('There was an error updating the group');
				return;
			}
			if (selectResponse.error || selectResponse.data === null) {
				console.error(selectResponse.data);
				setError('There was an error retrieving transacctions');
				return;
			}

			setSuccess('Successfully updated group!');
			setTransactions(selectResponse.data);
			handleReset();
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
