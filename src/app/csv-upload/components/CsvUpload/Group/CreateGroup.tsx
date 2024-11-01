import type React from 'react';
import { useForm } from 'react-hook-form';
import type { FindGroupsData, FormattedRowData, GroupData } from '@/app/types';
import { TransactionsTable } from '../TransactionsTable';
import Button from '@/app/components/Button';
import DataInput from './DataInput';
import useCategories from '@/app/hooks/useCategories';

interface CreateGroupProps {
	group: GroupData;
	setActiveElement: React.Dispatch<React.SetStateAction<number | undefined>>;
	setCSVData: React.Dispatch<React.SetStateAction<FindGroupsData | undefined>>;
	transactions: FormattedRowData[];
}

export default function CreateGroup({
	group,
	setActiveElement,
	transactions,
}: CreateGroupProps) {
	const { categories } = useCategories();
	const {
		formState: { errors },
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
			const date = new Date();
			const isoDate = date.toISOString();
			const updatedGroup: GroupData = { ...formData };
			const updatedTransactions: FormattedRowData[] = transactions.map(
				(transaction) => ({
					...transaction,
					category: formData.category,
					created: isoDate,
					updated: isoDate,
				}),
			);

			updatedGroup.prime = updatedTransactions[0].uid;
			updatedGroup.created = isoDate;
			updatedGroup.updated = isoDate;

			const payload = {
				group: updatedGroup,
				transactions: updatedTransactions,
			};

			console.log(payload);
		}
	}

	return (
		<div className="bg-secondary pt-1 p-8 rounded-lg">
			<h3>Create Group</h3>

			<form className="form-control" onSubmit={handleSubmit(handleCreateGroup)}>
				<DataInput
					className={errors?.name ? 'input-error' : ''}
					fieldName="name"
					label="Name"
					{...register('name', { required: true })}
				/>

				<DataInput
					fieldName="description"
					label="Description"
					{...register('description', { required: true })}
				/>

				<DataInput
					fieldName="terms"
					label="Terms"
					{...register('terms', { required: true })}
				/>

				<div className="join join-horizontal mb-4">
					<DataInput
						className="join-item mr-1 w-1/2"
						fieldName="recurring"
						label={`Recurring ${group.recurring}`}
						type="checkbox"
						{...register('recurring')}
					/>

					<DataInput
						className="join-item w-1/2"
						disabled={!watchRecurring}
						fieldName="still_recurring"
						label="Still Recurring"
						type="checkbox"
						{...register('still_recurring')}
					/>
				</div>

				<DataInput
					fieldName="category"
					label="Category"
					type="select"
					options={categories}
				/>

				<DataInput
					fieldName="siteurl"
					label="Site Url"
					{...register('siteurl')}
				/>

				<DataInput
					className="mb-4"
					fieldName="notes"
					label="Notes"
					{...register('notes')}
				/>

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
