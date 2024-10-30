'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import apiCall from '@/app/utils/apiCall';
import CategoriesTable from './CategoriesTable';

interface CustomCategoriesProps {
	categories: string[];
	uid: string | false;
}

export default function CustomCategories({
	categories,
	uid,
}: CustomCategoriesProps) {
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const {
		formState: { errors },
		handleSubmit,
		register,
		reset,
	} = useForm<{ category: string }>();

	function handleCreateCategory({ category }: { category: string }) {
		setError('');
		setSuccess('');

		if (!Object.keys(errors).length && uid) {
			apiCall('/api/category-create', {
				onError: (msg) => setError(msg),
				onSuccess: (msg) => {
					setSuccess(msg);
					reset();
				},
				payload: {
					categories: [...categories, category],
					uid,
				},
				reload: '/categories',
			});
		}
	}

	return (
		<div>
			{error.length > 0 && (
				<div className="alert alert-error mb-6 text-white font-bold">
					{error}
				</div>
			)}
			{success.length > 0 && (
				<div className="alert alert-success mb-6 text-white font-bold">
					{success}
				</div>
			)}
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

			<CategoriesTable categories={categories} uid={uid} />
		</div>
	);
}
