import { useEffect, useState } from 'react';

interface FormMessagingProps {
	error?: string;
	success?: string;
}

function FormMessaging({ error, success }: FormMessagingProps) {
	const [close, setClose] = useState(false);

	const jsx = (
		<>
			{error && error.length > 0 && (
				<div className="alert alert-error mb-6 text-white font-bold">
					<span>X</span>
					<span>{error}</span>
				</div>
			)}
			{success && success.length > 0 && (
				<div className="alert alert-success mb-6 text-white font-bold">
					<span>
						<button
							className="btn btn-xs text-sm"
							onClick={() => setClose(true)}
							type="button"
						>
							X
						</button>
					</span>
					<span>{success}</span>
				</div>
			)}
		</>
	);

	if (close) return null;

	if (!error && !success) return null;

	if (error || success) return jsx;
}

export default function useFormMessaging() {
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	return {
		error,
		FormMessaging,
		setError,
		setSuccess,
		success,
		props: { error, success },
	};
}
