'use client';

import { useForm } from 'react-hook-form';
import parseCsv from './parseCsv';

interface CsvUploadProps {
	csvfile: FileList;
}

export default function CsvUpload() {
	const { handleSubmit, register } = useForm<CsvUploadProps>();

	async function handleCsvUpload(formData: CsvUploadProps) {
		const fileData: File = formData.csvfile[0];

		if (!fileData) {
			console.log('Error!!!');
			return;
		}

		const parsedData = await parseCsv(fileData);

		console.log(parsedData);
	}

	return (
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
	);
}
