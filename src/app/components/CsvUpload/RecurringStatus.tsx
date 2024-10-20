// DEPRECATED

import type { GroupData } from '@/app/types';
import type React from 'react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

const NOT_RECURRING = 'notRecurring';
const POSSIBLY_RECURRING = 'possiblyRecurring';
const RECURRING = 'recurring';

interface RecurringStatusProps {
	groupData: GroupData;
	setCSVData: React.Dispatch<React.SetStateAction<GroupData[]>>;
}

export default function RecurringStatus({
	groupData,
	setCSVData,
}: RecurringStatusProps) {
	const settings = groupData?.recurring
		? { default: RECURRING, class: 'btn-accent', label: 'Recurring' }
		: groupData.possiblyRecurring
			? {
					default: POSSIBLY_RECURRING,
					class: 'btn-accent',
					label: 'Possibly Recurring',
				}
			: { default: NOT_RECURRING, class: '', label: 'Not Recurring' };

	const [editing, setEditing] = useState(false);
	const { register, watch } = useForm({
		defaultValues: {
			recurring: settings.default,
		},
	});

	useEffect(() => {
		const { unsubscribe } = watch(({ recurring }) => {
			const { id } = groupData;

			setCSVData((state: GroupData[]) => {
				const entryIndex = state.findIndex((f: GroupData) => f.id === id);
				const newState = [...state];
				const newEntry = newState[entryIndex];

				if (recurring && recurring === RECURRING) {
					newState[entryIndex] = {
						...newEntry,
						[RECURRING]: true,
						[POSSIBLY_RECURRING]: false,
					};
				} else if (recurring && recurring === POSSIBLY_RECURRING) {
					newState[entryIndex] = {
						...newEntry,
						[RECURRING]: false,
						[POSSIBLY_RECURRING]: true,
					};
				} else {
					newState[entryIndex] = {
						...newEntry,
						[RECURRING]: false,
						[POSSIBLY_RECURRING]: false,
					};
				}

				return newState;
			});

			setEditing(false);
		});
		return () => unsubscribe();
	}, [groupData, setCSVData, watch]);

	return (
		<div>
			<form className="form-control ml-2">
				{editing && (
					<select
						className="select select-bordered select-xs"
						{...register('recurring')}
					>
						<option value={RECURRING}>Recurring</option>
						<option value={POSSIBLY_RECURRING}>Possibly Recurring</option>
						<option value={NOT_RECURRING}>Not Recurring</option>
					</select>
				)}

				{!editing && (
					<button
						className={`btn btn-xs ${settings.class}`}
						onClick={() => setEditing(true)}
						type="button"
					>
						{settings.label}
					</button>
				)}
			</form>
		</div>
	);
}
