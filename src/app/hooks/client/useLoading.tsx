'use client';

import { useState } from 'react';

interface LoadingProps {
	hideSpinner?: boolean;
	loading?: boolean;
}

function Loading({ hideSpinner = false, loading }: LoadingProps) {
	if (loading === false) return null;

	return (
		<div className="flex items-center justify-center absolute z-50 top-0 left-0 w-full h-full bg-white bg-opacity-70">
			{hideSpinner === false && (
				<div className="lds-grid relative">
					<div />
					<div />
					<div />
					<div />
					<div />
					<div />
					<div />
					<div />
					<div />
				</div>
			)}
		</div>
	);
}

export default function useLoading() {
	const [loading, _setLoading] = useState(false);

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const setLoading = (arg: boolean, callback?: (arg?: any) => void) => {
		if (arg) _setLoading(true);
		if (!arg)
			setTimeout(() => {
				_setLoading(false);
				if (callback) callback();
			}, 1500);
	};

	return { Loading, props: { loading }, setLoading };
}
