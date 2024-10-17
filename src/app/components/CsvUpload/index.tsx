'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import type { CsvUploadData, GroupData } from '../../types';
import Group from '../Group';
import parseCsv from './scripts/parseCsv';

export const WEEKLY = 'Weekly';
export const BIWEEKLY = 'BiWeekly';
export const MONTHLY = 'Monthly';

export default function CsvUpload() {
	const [data, setCSVData] = useState<GroupData[] | undefined>();
	const { handleSubmit, register } = useForm<CsvUploadData>();

	async function handleCsvUpload(formData: CsvUploadData) {
		const fileData: File = formData.csvfile[0];

		if (!fileData) {
			console.log('Error!!!');
			return;
		}

		const parsedData: GroupData[] = await parseCsv(fileData);

		setCSVData(parsedData);
	}

	return (
		<section>
			<form
				className="form-control p-4 join join-horizontal"
				onSubmit={handleSubmit(handleCsvUpload)}
			>
				<input
					accept=".csv"
					className="file-input file-input-bordered file-input-sm file-input-primary join-item"
					type="file"
					{...register('csvfile', { required: true })}
				/>
				<button type="submit" className="btn btn-accent btn-sm join-item">
					Upload
				</button>
			</form>

			{data?.map((group) => (
				<Group data={group} key={group.id} />
			))}
		</section>
	);
}
