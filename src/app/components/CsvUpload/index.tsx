'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import type { CsvUploadData, GroupData } from '../../types';
import Group from './Group';
import parseCsv from './scripts/parseCsv';

export const WEEKLY = 'Weekly';
export const BIWEEKLY = 'BiWeekly';
export const MONTHLY = 'Monthly';

export default function CsvUpload() {
	const [error, setError] = useState<string | null>();
	const [data, setCSVData] = useState<GroupData[]>([]);
	const { handleSubmit, register } = useForm<CsvUploadData>();

	async function handleCsvUpload(formData: CsvUploadData) {
		try {
			const fileData: File = formData.csvfile[0];

			if (!fileData) {
				console.log('Error!!!');
				return;
			}

			const parsedData: GroupData[] = await parseCsv(fileData);

			setCSVData(parsedData);
		} catch (err) {
			setError((err as Error).message);
		}
	}

	return (
		<section className="px-4">
			<form
				className="form-control py-4 join join-horizontal"
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

			{error && <div className="alert alert-error">{error}</div>}

			{data.length > 0 && (
				<>
					<div className="divider" />

					{data?.map((group) => (
						<Group groupData={group} key={group.id} setCSVData={setCSVData} />
					))}
				</>
			)}
		</section>
	);
}
