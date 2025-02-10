'use client';

import { Fragment, useState } from 'react';
import { apiCall, zebra } from '@/utils/app';
import {
	FormMessaging,
	useFormMessagingContext,
} from '@/app/components/context/FormMessaging';
import { useLoading } from '@/app/hooks/client';
import type { UserData } from '@/app/types';

interface CategoriesTableProps {
	categories: string[];
	setCategoryData: (arg: string[]) => void;
	uid: false | string;
}

export default function CategoriesTable({
	categories,
	setCategoryData,
	uid,
}: CategoriesTableProps) {
	// STATE
	const [activeRow, setActiveRow] = useState<boolean | number>(false);

	// CONTEXT
	const { setError, setSuccess } = useFormMessagingContext();

	// CUSTOM HOOKS
	const { Loading, props, setLoading } = useLoading();

	// HANDLERS
	async function handleDeleteCategory(category: string) {
		if (uid) {
			setLoading(true);

			const response = await apiCall<UserData>('/api/category/delete', {
				payload: {
					category,
					uid,
				},
			});

			setLoading(false, () => {
				if (
					!response.error &&
					response.data !== null &&
					'categories' in response.data &&
					response.data.categories !== null
				) {
					setCategoryData(response.data.categories);
					setActiveRow(false);
					setSuccess('Categoryy successfully deleted!');
				} else {
					console.error(response.error);
					setError('Error Deleting Category');
				}
			});
		}
	}

	return (
		<div className="overflow-x-auto relative">
			<FormMessaging />
			<Loading {...props} />

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
