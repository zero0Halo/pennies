'use client';

import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import type { UserData, CsvUploadData, FindGroupsData } from '@/app/types';
import Group from './Group';
import parseCsv from './scripts/parseCsv';
import Stats from './Stats';
import TransactionsTable from './TransactionsTable';
import Button from '@/app/components/Button';
import CompletedGroup from './Group/GroupCompleted';
import useClientCookie from '@/app/hooks/useClientCookie';
import { USER } from '@/app/constants';
import useAccounts from '@/app/hooks/useAccounts';
import Label from '@/app/components/Label';
import Select from '@/app/components/Select';
import useFormMessaging from '@/app/hooks/useFormMessaging';

export default function CsvUpload() {
	const [activeElement, setActiveElement] = useState<number | undefined>();
	const { props, setSuccess, setError, FormMessaging } = useFormMessaging();
	// const [error, setError] = useState<string | null>();
	const [groupsData, setCSVData] = useState<FindGroupsData | undefined>(
		undefined,
	);
	const [previousData, setPreviousData] = useState<
		FindGroupsData | false | undefined
	>(undefined);
	const [userData] = useClientCookie<UserData>(USER);
	const { options } = useAccounts();
	const { watch, handleSubmit, register } = useForm<CsvUploadData>();
	const noFileChosen = watch('csvfile') === undefined;
	const completed =
		groupsData !== undefined
			? groupsData.groups.filter(({ group }) => group.name !== false)
			: [];

	// Check for CSV data in local storage
	useEffect(() => {
		if (!groupsData && previousData === undefined) {
			const localStorageData =
				typeof window !== 'undefined'
					? (localStorage.getItem('csv-upload') ?? false)
					: false;

			setPreviousData(localStorageData ? JSON.parse(localStorageData) : false);
		}
	}, [groupsData, previousData]);

	async function handleCsvUpload(formData: CsvUploadData) {
		try {
			const fileData: File = formData.csvfile[0];

			if (!fileData) {
				console.log('Error!!!');
				return;
			}

			const accountUid = formData.account;
			const parsedData: FindGroupsData | boolean = await parseCsv(
				fileData,
				userData,
				accountUid,
			);

			if (typeof parsedData !== 'boolean') {
				setSuccess('CSV Data Parsed!');
				setCSVData(parsedData);
			}
		} catch (err) {
			setError((err as Error).message);
		}
	}

	return (
		<section className="px-4">
			{/* Show previous data warning */}
			{previousData && !groupsData && (
				<div className="alert bg-slate-200 shadow font-bold">
					<div>A previous session was detected. Would you like to load it?</div>

					<Button
						className="btn-error join-item"
						onClick={() => setPreviousData(false)}
					>
						No
					</Button>
					<Button
						className="btn-success join-item"
						onClick={() => setCSVData(previousData)}
					>
						Yes
					</Button>
				</div>
			)}

			{/* Show CSV file uploader */}
			{!groupsData && previousData === false && (
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
					<Label className="join-item" htmlFor="account">
						Account
						<Select options={options} {...register('account')} />
					</Label>
					<button
						type="submit"
						className="btn btn-accent btn-sm join-item"
						disabled={noFileChosen}
					>
						Upload
					</button>
				</form>
			)}

			{/* Show CSV stats */}
			{groupsData && (
				<>
					<Stats groupsData={groupsData} />
					<FormMessaging {...props} />
				</>
			)}

			{/* Show groups */}
			{groupsData && groupsData.groups.length > 0 && (
				<>
					<div className="divider" />

					<div role="tablist" className="tabs tabs-lifted">
						<input
							aria-label={`Reviewing (${groupsData.groups.length - completed.length})`}
							className="tab after:whitespace-nowrap"
							defaultChecked
							name="group_tabs"
							role="tab"
							type="radio"
						/>
						<div
							role="tabpanel"
							className="tab-content bg-base-100 border-base-300 rounded-box px-2 py-6"
						>
							{groupsData.groups?.map(
								(groupData, index) =>
									typeof groupData.group.name === 'boolean' && (
										<Group
											activeElement={activeElement}
											index={index}
											groupData={groupData}
											key={groupData.group.uid}
											setActiveElement={setActiveElement}
											setCSVData={setCSVData}
											setError={setError}
											setSuccess={setSuccess}
										/>
									),
							)}
						</div>

						<input
							aria-label={`Completed${completed.length > 0 ? ` (${completed.length})` : ''}`}
							className="tab after:whitespace-nowrap"
							name="group_tabs"
							role="tab"
							type="radio"
						/>
						<div
							role="tabpanel"
							className="tab-content bg-base-100 border-base-300 rounded-xl p-4 pb-0"
						>
							{completed.map((groupData, index) => (
								<CompletedGroup
									groupsData={groupData}
									index={index}
									key={groupData.group.uid}
								/>
							))}
						</div>
					</div>
				</>
			)}

			{/* Show singletons */}
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
