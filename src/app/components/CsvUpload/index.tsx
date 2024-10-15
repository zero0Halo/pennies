'use client';

import type { Dayjs } from 'dayjs';
import { useForm } from 'react-hook-form';
import parseCsv from './parseCsv';
import { useState } from 'react';

interface CsvUploadProps {
	csvfile: FileList;
}

export interface FormattedDataProps {
	amount: number;
	date: string;
	description: string;
	id: string;
	terms: string[];
	timestamp: Dayjs;
}
export interface FindRecurringProps {
	description: string;
	id: string;
	prime: FormattedDataProps;
	transactions: FormattedDataProps[];
}

export default function CsvUpload() {
	const [data, setData] = useState<FindRecurringProps[] | undefined>();
	const { handleSubmit, register } = useForm<CsvUploadProps>();

	async function handleCsvUpload(formData: CsvUploadProps) {
		const fileData: File = formData.csvfile[0];

		if (!fileData) {
			console.log('Error!!!');
			return;
		}

		const parsedData: FindRecurringProps[] = await parseCsv(fileData);

		setData(parsedData);
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

			{data?.map(({ id, description, prime, transactions }) => (
				<div className="px-4" key={id}>
					<h4 className="mb-0">
						<span>{description}</span>

						<span className="badge badge-secondary ml-2">
							{transactions.length + 1}
						</span>
					</h4>

					<div>({prime.terms.join(', ')})</div>

					<div className="overflow-x-auto">
						<table className="table table-zebra">
							<thead>
								<tr>
									<th />
									<th>Description</th>
									<th>Amount</th>
									<th>Date</th>
								</tr>
							</thead>

							<tbody>
								<tr className="bg-primary">
									<th>1</th>
									<td>{prime.description}</td>
									<td>{prime.amount}</td>
									<td>{prime.date}</td>
								</tr>

								{transactions.length > 1 &&
									transactions.map((transaction, i) => (
										<tr key={transaction.id}>
											<th>{i + 2}</th>
											<td>{transaction.description}</td>
											<td>{transaction.amount}</td>
											<td>{transaction.date}</td>
										</tr>
									))}
							</tbody>
						</table>
					</div>

					<div className="divider" />
				</div>
			))}
		</section>
	);
}
