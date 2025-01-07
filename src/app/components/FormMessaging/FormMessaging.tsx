'use client';

import { useEffect, useRef } from 'react';
import {
	useFormMessagingContext,
	type FormMessagingContextData,
} from './FormMessagingProvider';

// COMPONENT
export default function FormMessaging() {
	// CUSTOM HOOKS
	const { close, error, reset, setClose, success }: FormMessagingContextData =
		useFormMessagingContext();

	// REFS
	const timerRef = useRef<NodeJS.Timeout | null>(null);

	// EFFECTS
	useEffect(() => {
		if (success.length) {
			if (timerRef.current) clearTimeout(timerRef.current);

			timerRef.current = setTimeout(() => {
				reset();
				timerRef.current = null; // Reset ref
			}, 3000);

			return () => {
				if (timerRef.current) clearTimeout(timerRef.current);
			};
		}
	}, [reset, success]);

	const jsx = true && (
		<div className="fixed top-0  left-1/2 transform -translate-x-1/2 z-50">
			<div
				className={`alert alert-${error?.length ? 'error' : 'success'} my-6 text-white font-bold shadow-xl`}
			>
				<button
					className="btn btn-xs text-xs text-white x"
					onClick={() => setClose(true)}
					type="button"
				/>
				<span>{error?.length ? error : success}</span>
			</div>
		</div>
	);

	if (close) return null;

	if (!error && !success) return null;

	if (error || success) return jsx;
}
