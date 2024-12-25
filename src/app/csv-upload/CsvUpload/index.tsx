'use client';

import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import Group from './Group';
import Button from '@/app/components/Button';
import Label from '@/app/components/Label';
import Select from '@/app/components/Select';
import CompletedGroup from './Group/GroupCompleted';
import Stats from './Stats';
import TransactionsTable from './TransactionsTable';
import { useAccounts, useClientCookie } from '@/app/hooks/client';
import parseCsv from './scripts/parseCsv';
import { USER } from '@/app/constants';
import type { UserData, CsvUploadData, FindGroupsData } from '@/app/types';
import { useFormMessagingContext } from '@/app/components/FormMessaging/FormMessagingProvider';
import FormMessaging from '@/app/components/FormMessaging/FormMessaging';
import useOrganizedCsvData from '@/app/hooks/client/useOrganizedCsvData';
import ButtonToggles from '@/app/playground/ButtonToggles';
import TabList from '@/app/components/TabList';

export default function CsvUpload() {
	// STATE
	const [activeElement, setActiveElement] = useState<number | undefined>();
	const [CSVData, setCSVData] = useState<FindGroupsData | undefined>(undefined);
	const [previousData, setPreviousData] = useState<
		FindGroupsData | false | undefined
	>(undefined);

	// CUSTOM HOOKS
	const { setError, setSuccess } = useFormMessagingContext();
	const { data: userData, error: userDataError } =
		useClientCookie<UserData>(USER);
	const { options } = useAccounts();
	const organizedCsvData = useOrganizedCsvData({ CSVData });

	// REACT FORM
	const { watch, handleSubmit, register } = useForm<CsvUploadData>();
	const noFileChosen = watch('csvfile') === undefined;

	if (userDataError) {
		console.error(userDataError);
		return null;
	}

	// Check for CSV data in local storage
	useEffect(() => {
		if (!CSVData && previousData === undefined) {
			const localStorageData =
				typeof window !== 'undefined'
					? (localStorage.getItem('csv-upload') ?? false)
					: false;

			setPreviousData(localStorageData ? JSON.parse(localStorageData) : false);
		}
	}, [CSVData, previousData]);

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
		<section className="px-4 relative">
			<FormMessaging />

			{/* Show previous data warning */}
			{previousData && !CSVData && (
				<div className="alert bg-slate-200 shadow font-bold">
					<div>A previous session was detected. Would you like to load it?</div>

					<div className="join join-horizontal">
						<Button
							className="btn-error join-item mr-1"
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
				</div>
			)}

			{/* Show CSV file uploader */}
			{!CSVData && previousData === false && (
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
			{CSVData && <Stats groupsData={CSVData} />}

			{/* Show not completed groups & transactions */}
			{organizedCsvData &&
				(organizedCsvData.notCompleted.groups.length > 0 ||
					organizedCsvData.notCompleted.singletons.length > 0) && (
					<>
						<div className="divider" />

						<TabList name="transaction-review-panels">
							<div data-title="Reviewing">
								<ButtonToggles
									buttons={[
										{ label: 'All' },
										{ label: 'Groups' },
										{ label: 'Singletons' },
									]}
									className="mb-6 mx-auto"
									onClick={(label) => console.log(label)}
								/>

								{organizedCsvData.notCompleted.groups?.map(
									(groupData, index) => (
										<Group
											activeElement={activeElement}
											index={index}
											groupData={groupData}
											key={groupData.group.uid}
											setActiveElement={setActiveElement}
											setCSVData={setCSVData}
										/>
									),
								)}
								{organizedCsvData.notCompleted.singletons.length > 0 && (
									<>
										<div className="divider" />

										<h3>Ungrouped (Singletons)</h3>

										<TransactionsTable
											setCSVData={setCSVData}
											transactions={organizedCsvData.notCompleted.singletons}
										/>
									</>
								)}
							</div>

							<div data-title="Completed">
								{organizedCsvData.completed.groups.map((groupData, index) => (
									<CompletedGroup
										groupsData={groupData}
										index={index}
										key={groupData.group.uid}
									/>
								))}
							</div>
						</TabList>
					</>
				)}
		</section>
	);
}
