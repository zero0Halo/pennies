'use client';

import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import Button from '@/app/components/Button';
import Label from '@/app/components/Label';
import Select from '@/app/components/Select';
import ParseCSV from '@/app/csv-upload/ParseCSV';
import type { CsvUploadData, ParseCSVData } from '@/app/types';
import { useFormMessagingContext } from '@/app/components/context/FormMessaging/FormMessagingProvider';
import FormMessaging from '@/app/components/context/FormMessaging/FormMessaging';
import useOrganizedCsvData from '@/app/hooks/client/useOrganizedCsvData';
import ButtonToggles, {
	type ToggleStateData,
} from '@/app/components/ButtonToggles';
import Groups from '@/app/components/Groups';
import Transactions from '@/app/components/Transactions';
import StatRow from '@/app/components/StatRow';
import useUserCookie from '@/app/hooks/useUserCookie/client';
import TabList, { TabPanel } from '@/app/components/TabList';
import useAccountsCookie from '@/app/hooks/useAccountsCookie/client';
import { useCSVUploadContext } from './CSVUploadProvider';

export default function CsvUpload() {
	// STATE
	const [previousData, setPreviousData] = useState<
		ParseCSVData | false | undefined
	>();
	const [toggleState, setToggleState] = useState<ToggleStateData>({
		all: true,
		groups: false,
		singletons: false,
	});

	// CONTEXT
	const { CSVData, setCSVData } = useCSVUploadContext();
	const { setError, setSuccess } = useFormMessagingContext();

	// CUSTOM HOOKS
	const { user: userData, userError } = useUserCookie();
	if ((console.error(userError), userError)) return null; // abusing comma operator for brevity

	// CUSTOM HOOKS cont.
	const { defaultAccount, options } = useAccountsCookie();
	if (options === null) return null; // To shut up TS

	// CUSTOM HOOKS cont.
	const organizedCsvData = useOrganizedCsvData({ CSVData });

	// REACT FORM
	const { watch, handleSubmit, register, setValue } = useForm<CsvUploadData>();
	const noFileChosen = watch('csvfile') === undefined;

	// EFFECTS
	useEffect(() => {
		// Check for CSV data in local storage
		if (!CSVData && previousData === undefined) {
			const localStorageData =
				typeof window !== 'undefined'
					? (localStorage.getItem('csv-upload') ?? false)
					: false;

			setPreviousData(localStorageData ? JSON.parse(localStorageData) : false);
		}
	}, [CSVData, previousData]);

	useEffect(() => {
		// Set the default account as the selected account on load
		if (defaultAccount !== null) {
			setValue('account', defaultAccount.uid);
		}
	}, [defaultAccount, setValue]);

	// HANDLERS
	async function handleCsvUpload(formData: CsvUploadData) {
		try {
			const fileData: File = formData.csvfile[0];

			if (!fileData) {
				console.log('Error!!!');
				return;
			}

			const accountUid = formData.account;
			const parseCSV = new ParseCSV({ fileData, userData, accountUid });
			const parsedData = await parseCSV.go();

			if (typeof parsedData !== 'boolean') {
				setSuccess('CSV Data Parsed!');
				setCSVData?.(parsedData);
			}
		} catch (err) {
			setError((err as Error).message);
		}
	}

	// SHUGAH
	const statsArray = [
		{ label: '# of Transactions', value: CSVData?.total },
		{ label: '# of Groups', value: CSVData?.groups?.length },
		{
			label: '# of Singletons',
			value: CSVData?.singletons?.length,
		},
	];

	// JSX
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
							onClick={() => setCSVData?.(previousData)}
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
			{CSVData && <StatRow stats={statsArray} />}

			{/* Show not completed groups & transactions */}
			{organizedCsvData &&
				(organizedCsvData.notCompleted.groups.length > 0 ||
					organizedCsvData.notCompleted.singletons.length > 0) && (
					<>
						<div className="divider" />

						<TabList>
							<TabPanel
								title={`Reviewing (${(CSVData as ParseCSVData)?.total - organizedCsvData.totalComplete})`}
							>
								<ButtonToggles
									className="mb-6 mx-auto"
									setToggleState={setToggleState}
									toggleState={toggleState}
								/>

								<Groups
									className={
										toggleState.groups || toggleState.all ? 'block' : 'hidden'
									}
									groupsData={organizedCsvData.notCompleted.groups}
								/>

								<div
									className={`divider pt-6${toggleState.all ? ' flex' : ' hidden'}`}
								/>

								<Transactions
									className={
										toggleState.singletons || toggleState.all
											? 'block'
											: 'hidden'
									}
									title="Singletons"
									transactions={organizedCsvData.notCompleted.singletons}
									view="singleton"
								/>
							</TabPanel>

							<TabPanel title={`Completed (${organizedCsvData.totalComplete})`}>
								<ButtonToggles
									className="mb-6 mx-auto"
									setToggleState={setToggleState}
									toggleState={toggleState}
								/>

								<Groups
									className={
										toggleState.groups || toggleState.all ? 'block' : 'hidden'
									}
									groupsData={organizedCsvData.completed.groups}
									title="Groups Completed"
									view="groupsComplete"
								/>

								<div
									className={`divider pt-6${toggleState.all ? ' flex' : ' hidden'}`}
								/>

								<Transactions
									className={
										toggleState.singletons || toggleState.all
											? 'block'
											: 'hidden'
									}
									title="Completed Singletons"
									transactions={organizedCsvData.completed.singletons}
									view="singletonComplete"
								/>
							</TabPanel>
						</TabList>
					</>
				)}
		</section>
	);
}
