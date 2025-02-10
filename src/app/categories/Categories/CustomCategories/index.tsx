'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import CategoriesTable from './CategoriesTable';
import { useCategories, useLoading } from '@/app/hooks/client';
import { apiCall } from '@/utils/app';
import {
	FormMessaging,
	useFormMessagingContext,
} from '@/app/components/context/FormMessaging';
import type { UserData } from '@/app/types';

interface CustomCategoriesProps {
	uid: string | false;
}

// COMPONENT
export default function CustomCategories({ uid }: CustomCategoriesProps) {
	// CONTEXT
	const { setError, setSuccess } = useFormMessagingContext();

	// REACT-FORM
	const {
		formState: { errors },
		handleSubmit,
		register,
		reset,
	} = useForm<{ category: string }>();

	// CUSTOM  HOOKS
	const { customCategories } = useCategories();
	const { Loading, props, setLoading } = useLoading();

	// STATE
	const [categoryData, setCategoryData] = useState<string[] | undefined>();

	// HANDLERS
	async function handleCreateCategory({ category }: { category: string }) {
		setError('');
		setSuccess('');
		setLoading(true);

		if (!Object.keys(errors).length && uid) {
			const response = await apiCall<UserData>('/api/category/create', {
				payload: {
					categories: [...(categoryData ?? []), category],
					uid,
				},
			});

			if (
				!response.error &&
				response.data !== null &&
				'categories' in response.data &&
				response.data.categories !== null
			) {
				setLoading(false, () => {
					setSuccess('Successfully Created Category');
					setCategoryData((response.data as UserData).categories as string[]);
					reset();
				});
			} else if (response.error) {
				setLoading(false, () => {
					console.error(response.error);
					setError('Error Creating Category');
				});
			}
		}
	}

	// EFFECTS
	useEffect(() => {
		if (!categoryData && customCategories.length > 0) {
			setCategoryData(customCategories);
		}
	}, [categoryData, customCategories]);

	// JSX
	return (
		<div className="relative">
			<FormMessaging />
			<Loading {...props} />

			<form
				className="form-control join join-horizontal"
				onSubmit={handleSubmit(handleCreateCategory)}
			>
				<input
					type="text"
					className={`input input-text input-sm input-bordered join-item${errors?.category ? ' input-error' : ''}`}
					{...register('category', { required: true })}
				/>
				<button
					type="submit"
					className={'btn btn-success btn-sm text-white font-bold join-item'}
				>
					Create
				</button>
			</form>

			<CategoriesTable
				categories={categoryData ?? []}
				uid={uid}
				setCategoryData={setCategoryData}
			/>
		</div>
	);
}
