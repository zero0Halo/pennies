'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import type { CsvUploadData, GroupData } from '@/app/types';
import Group from './Group';
import parseCsv from './scripts/parseCsv';

export const WEEKLY = 'Weekly';
export const BIWEEKLY = 'BiWeekly';
export const MONTHLY = 'Monthly';

export default function CsvUpload() {
	const [error, setError] = useState<string | null>();
	const [data, setCSVData] = useState<GroupData[]>([]);
	const { watch, handleSubmit, register } = useForm<CsvUploadData>();
	const noFileChosen = watch('csvfile') === undefined;

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

	const numTotal = data.reduce(
		(acc, current) => acc + current.transactions.length,
		data.length,
	);
	const groups = data.filter((f) => f.transactions.length);
	const numGroupTransactions = groups.reduce(
		(acc, current) => acc + current.transactions.length,
		groups.length,
	);
	const recurringGroups = groups.filter((f) => f.recurring);
	const singletons = data.filter((f) => !f.transactions.length);

	const stats = [
		{ label: '# of Transactions', value: numTotal },
		{
			label: '# of Groups',
			value: groups.length,
			description: `${recurringGroups.length} Recurring`,
		},
		{ label: '# of Transactions in Groups', value: numGroupTransactions },
		{ label: '# of Ungrouped Transactions', value: singletons.length },
	];

	return (
		<section className="px-4">
			{numTotal > 0 && (
				<div className="stats w-full">
					{stats.map((stat) => (
						<div className="stat" key={stat.label}>
							<span className="stat-title">{stat.label}</span>
							<span className="stat-value">{stat.value}</span>
							<span className="stat-desc h-4">{stat.description ?? ' '}</span>
						</div>
					))}
				</div>
			)}

			{data.length === 0 && (
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

			{data.length > 0 && (
				<>
					<div className="divider" />

					{data?.map((group) => (
						<Group groupData={group} key={group.uid} setCSVData={setCSVData} />
					))}
				</>
			)}
		</section>
	);
}
