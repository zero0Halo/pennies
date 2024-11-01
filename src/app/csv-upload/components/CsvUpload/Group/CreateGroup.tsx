import type React from 'react';
import { useForm } from 'react-hook-form';
import type { FormattedRowData, GroupData } from '@/app/types';
import { TransactionsTable } from '../TransactionsTable';
import Button from '@/app/components/Button';

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
	const { register, watch } = useForm<GroupData>({
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

	return (
		<div className="bg-secondary pt-1 p-8 rounded-lg">
			<h3>Create Group</h3>
			<form className="form-control">
				<label
					className="input input-bordered input-sm flex items-center gap-2 mb-2 font-bold"
					htmlFor="name"
				>
					Name:
					<input
						className="grow font-normal"
						placeholder="Type here..."
						type="text"
						{...register('name')}
					/>
				</label>

				<label
					className="input input-bordered input-sm flex items-center gap-2 mb-2 font-bold"
					htmlFor="description"
				>
					Description:
					<input
						className="grow font-normal"
						placeholder="Type here..."
						type="text"
						{...register('description')}
					/>
				</label>

				<label
					className="input input-bordered input-sm flex items-center gap-2 mb-2 font-bold"
					htmlFor="description"
				>
					Terms:
					<input
						className="grow font-normal"
						type="text"
						{...register('terms')}
					/>
				</label>

				<div className="join join-horizontal">
					<label className="input cursor-pointer input-bordered input-sm flex items-center gap-2 mb-2 font-bold join-item mr-1 w-1/2">
						Recurring {group.recurring}:
						<input
							type="checkbox"
							className="checkbox  checkbox-sm"
							{...register('recurring')}
						/>
					</label>

					<label className="input cursor-pointer input-bordered input-sm flex items-center gap-2 mb-3 font-bold join-item w-1/2">
						Still Recurring:
						<input
							className="checkbox  checkbox-sm"
							disabled={!watchRecurring}
							type="checkbox"
							{...register('still_recurring')}
						/>
					</label>
				</div>

				<label
					className="input input-bordered input-sm flex items-center gap-2 mb-2 font-bold"
					htmlFor="siteurl"
				>
					Site Url:
					<input
						className="grow font-normal"
						type="text"
						{...register('siteurl')}
					/>
				</label>

				<label
					className="input input-bordered input-sm flex items-center gap-2 mb-2 font-bold"
					htmlFor="notes"
				>
					Notes:
					<input
						className="grow font-normal"
						type="text"
						{...register('notes')}
					/>
				</label>
			</form>

			<TransactionsTable transactions={transactions} />

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
				<Button className=" btn-success join-item  w-1/2">Create Group</Button>
			</div>
		</div>
	);
}
