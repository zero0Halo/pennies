'use client';

import { Fragment, useState } from 'react';
import { apiCall, zebra } from '@/utils/app';

interface CategoriesTableProps {
	categories: string[];
	uid: false | string;
}

export default function CategoriesTable({
	categories,
	uid,
}: CategoriesTableProps) {
	const [activeRow, setActiveRow] = useState<boolean | number>(false);
	const [error, setError] = useState<string>('');
	const [success, setSuccess] = useState<string>('');

	async function handleDeleteCategory(category: string) {
		if (uid) {
			apiCall('/api/category/delete', {
				onError: (msg) => setError(msg),
				onSuccess: (msg) => setSuccess(msg),
				payload: {
					category,
					uid,
				},
				reload: '/categories',
			});
		}
	}

	return (
		<div className="overflow-x-auto">
			{error.length > 0 && (
				<div className="alert alert-error mb-6 mt-6 text-white font-bold">
					{error}
				</div>
			)}
			{success.length > 0 && (
				<div className="alert alert-success mb-6 mt-6 text-white font-bold">
					{success}
				</div>
			)}

			<table className="table">
				<thead>
					<tr className="bg-neutral">
						<th className="py-1 w-1/12" />
						<th className="py-1 text-white text-base w-9/12">Name</th>
						<th className="py-1 w-2/12" />
					</tr>
				</thead>

				<tbody>
					{categories.length > 0 &&
						categories.map((category, index) => (
							<Fragment key={category}>
								<tr className={zebra(index)}>
									<th>{index + 1}</th>
									<td>{category}</td>
									<td>
										{activeRow === index ? (
											<div className="join join-horizontal">
												<button
													className="btn btn-error btn-xs text-white join-item mr-1"
													onClick={() => handleDeleteCategory(category)}
													type="button"
												>
													Delete
												</button>
												<button
													className="btn btn-warning btn-xs text-white join-item"
													onClick={() => setActiveRow(false)}
													type="button"
												>
													Cancel
												</button>
											</div>
										) : (
											<button
												className="btn btn-error btn-xs text-white"
												onClick={() => setActiveRow(index)}
												type="button"
											>
												Delete
											</button>
										)}
									</td>
								</tr>

								{activeRow === index && (
									<tr className={zebra(index)}>
										<td colSpan={3}>
											<div className="alert alert-warning font-bold">
												You are about to delete the "{category}" category. If
												you have any transactions that currently use this
												category, they will have this category removed. Click
												"Delete" to confirm the deletion.
											</div>
										</td>
									</tr>
								)}
							</Fragment>
						))}
				</tbody>
			</table>
		</div>
	);
}
