import type React from 'react';
import { useForm } from 'react-hook-form';
import type { FormattedRowData, GroupData } from '@/app/types';
import { TransactionsTable } from '../TransactionsTable';
import Button from '@/app/components/Button';
import Input from './Input';

interface CreateGroupProps {
	group: GroupData;
	setActiveElement: React.Dispatch<React.SetStateAction<number | undefined>>;
	transactions: FormattedRowData[];
}

export default function CreateGroup({
	group,
	setActiveElement,
	transactions,
}: CreateGroupProps) {
	const {
		formState: errors,
		handleSubmit,
		register,
		watch,
	} = useForm<GroupData>({
		defaultValues: {
			description: group.description,
			name: group.name,
			notes: group.notes,
			recurring: !!group.recurring,
			siteurl: group.siteurl,
			still_recurring: group.still_recurring,
			terms: Array.isArray(group.terms) ? group.terms.join(', ') : group.terms,
		},
	});
	const watchRecurring = watch('recurring');

	function handleCreateGroup(formData: GroupData) {
		if (Object.keys(errors).length === 0) {
			console.log(formData);
		} else {
			console.error(errors);
		}
	}

	return (
		<div className="bg-secondary pt-1 p-8 rounded-lg">
			<h3>Create Group</h3>

			<form className="form-control" onSubmit={handleSubmit(handleCreateGroup)}>
				<Input
					fieldName="name"
					label="Name"
					{...register('name', { required: true })}
				/>

				<Input
					fieldName="description"
					label="Description"
					{...register('description', { required: true })}
				/>

				<Input
					fieldName="terms"
					label="Terms"
					{...register('terms', { required: true })}
				/>

				<div className="join join-horizontal">
					<Input
						className="join-item mr-1 w-1/2"
						fieldName="recurring"
						label={`Recurring ${group.recurring}`}
						type="checkbox"
						{...register('recurring')}
					/>

					<Input
						className="join-item w-1/2"
						disabled={!watchRecurring}
						fieldName="still_recurring"
						label="Still Recurring"
						type="checkbox"
						{...register('still_recurring')}
					/>
				</div>

				<Input fieldName="siteurl" label="Site Url" {...register('siteurl')} />

				<Input fieldName="notes" label="Notes" {...register('notes')} />

				<div
					// biome-ignore lint/a11y/noNoninteractiveTabindex: <explanation>
					tabIndex={0}
					className="collapse collapse-plus border-base-300 bg-accent mt-2 mb-4 rounded-xl overflow-hidden border"
				>
					<div className="collapse-title text-md font-bold">Transactions</div>
					<div className="collapse-content">
						<TransactionsTable transactions={transactions} />
					</div>
				</div>

				<div className="join join-horizontal w-full shadow">
					<Button
						className="btn-warning join-item mr-1 w-1/2"
						onClick={() =>
							typeof setActiveElement === 'function' &&
							setActiveElement(undefined)
						}
					>
						Cancel
					</Button>
					<Button className=" btn-success join-item  w-1/2" type="submit">
						Create Group
					</Button>
				</div>
			</form>
		</div>
	);
}
