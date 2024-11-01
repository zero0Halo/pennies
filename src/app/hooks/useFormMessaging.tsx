import { useState } from 'react';

interface FormMessagingProps {
	error: string;
	success: string;
}

export default function useFormMessaging() {
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	function FormMessaging({ error, success }: FormMessagingProps) {
		if (!error && !success) return null;

		return (
			<>
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
			</>
		);
	}

	return { error, FormMessaging, setError, setSuccess, success };
}
