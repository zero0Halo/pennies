'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import type { CsvUploadData, FindGroupsData } from '@/app/types';
import Group from './Group';
import parseCsv from './scripts/parseCsv';
import Stats from './Stats';
import { TransactionsTable } from './TransactionsTable';

export default function CsvUpload() {
	const [activeElement, setActiveElement] = useState<number | undefined>();
	const [error, setError] = useState<string | null>();
	const [groupsData, setCSVData] = useState<FindGroupsData | undefined>(
		undefined,
	);
	const { watch, handleSubmit, register } = useForm<CsvUploadData>();
	const noFileChosen = watch('csvfile') === undefined;

	async function handleCsvUpload(formData: CsvUploadData) {
		try {
			const fileData: File = formData.csvfile[0];

			if (!fileData) {
				console.log('Error!!!');
				return;
			}

			const parsedData: FindGroupsData = await parseCsv(fileData);

			setCSVData(parsedData);
		} catch (err) {
			setError((err as Error).message);
		}
	}

	return (
		<section className="px-4">
			{groupsData && <Stats groupsData={groupsData} />}

			{!groupsData && (
				<>
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
						<button
							type="submit"
							className="btn btn-accent btn-sm join-item"
							disabled={noFileChosen}
						>
							Upload
						</button>
					</form>

					{error && <div className="alert alert-error">{error}</div>}
				</>
			)}

			{groupsData && groupsData.groups.length > 0 && (
				<>
					<div className="divider" />

					<h3>Grouped</h3>

					{groupsData.groups?.map((groupData, index) => (
						<Group
							activeElement={activeElement}
							index={index}
							groupData={groupData}
							key={groupData.group.uid}
							setActiveElement={setActiveElement}
							setCSVData={setCSVData}
						/>
					))}
				</>
			)}

			{groupsData && groupsData.singletons.length > 0 && (
				<>
					<div className="divider" />

					<h3>Ungrouped (Singletons)</h3>

					<TransactionsTable transactions={groupsData.singletons} />
				</>
			)}
		</section>
	);
}
