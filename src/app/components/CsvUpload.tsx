'use client';

import { useForm } from 'react-hook-form';
import Papa from 'papaparse';

interface CsvUploadProps {
	csvfile: FileList;
}

export default function CsvUpload() {
	const { handleSubmit, register } = useForm<CsvUploadProps>();

	function handleCsvUpload(formData: CsvUploadProps) {
		const fileData: File = formData.csvfile[0];

		if (!fileData) {
			console.log('Error!!!');
			return;
		}

		Papa.parse<string[]>(fileData, {
			complete: ({ data }) => {
				const x = data.map((d: string[]) => {
					const filteredData = d.filter((f) => f.length > 2);
					return {
						date: filteredData?.at(0),
						amount: filteredData?.at(1),
						description: filteredData?.at(2)?.toLowerCase(),
					};
				});
				console.log(x);
			},
		});
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
