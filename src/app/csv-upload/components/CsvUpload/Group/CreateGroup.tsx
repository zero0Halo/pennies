import type React from 'react';
import { useForm } from 'react-hook-form';
import type { FormattedRowData, GroupData } from '@/app/types';
import { TransactionsTable } from '../TransactionsTable';

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
	const { register, watch } = useForm({
		defaultValues: {
			description: group.description,
			name: group.name,
			recurring: !!group.recurring,
			still_recurring: group.stillRecurring,
			terms: group.terms.join(', '),
		},
	});

	const watchRecurring = watch('recurring');

	console.log(group);
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

					<label className="input cursor-pointer input-bordered input-sm flex items-center gap-2 mb-2 font-bold join-item w-1/2">
						Still Recurring:
						<input
							className="checkbox  checkbox-sm"
							disabled={!watchRecurring}
							type="checkbox"
							{...register('still_recurring')}
						/>
					</label>
				</div>
			</form>

			<TransactionsTable transactions={transactions} />

			<div className="join join-horizontal w-full shadow">
				<button
					className="btn btn-sm btn-warning text-black font-bold join-item mr-1 w-1/2"
					onClick={() =>
						typeof setActiveElement === 'function' &&
						setActiveElement(undefined)
					}
					type="button"
				>
					Cancel
				</button>
				<button
					className="btn btn-sm btn-success text-white font-bold join-item  w-1/2"
					type="button"
				>
					Create Group
				</button>
			</div>
		</div>
	);
}
