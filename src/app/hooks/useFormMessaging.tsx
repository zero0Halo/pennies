import { useState } from 'react';

interface FormMessagingProps {
	close: boolean;
	error?: string;
	success?: string;
	setClose: (arg: boolean) => void;
}

function FormMessaging({
	close,
	error,
	setClose,
	success,
}: FormMessagingProps) {
	const jsx = (
		<>
			{error && error.length > 0 && (
				<div className="alert alert-error my-6 text-white font-bold">
					<span>X</span>
					<span>{error}</span>
				</div>
			)}
			{success && success.length > 0 && (
				<div className="alert alert-success my-6 text-white font-bold">
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
	const [error, _setError] = useState('');
	const [success, _setSuccess] = useState('');
	const [close, setClose] = useState(false);

	const setError = (msg: string) => {
		_setSuccess('');
		setClose(false);
		_setError(msg);
	};

	const setSuccess = (msg: string) => {
		_setError('');
		setClose(false);
		_setSuccess(msg);
	};

	return {
		close,
		error,
		FormMessaging,
		setClose,
		setError,
		setSuccess,
		success,
		props: { close, error, setClose, success },
	};
}
