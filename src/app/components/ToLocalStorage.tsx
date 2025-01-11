'use client';

import storage from '@/utils/app/storage';
import type React from 'react';
import { useEffect, useRef } from 'react';

interface ToLocalStorageProps {
	// biome-ignore lint/suspicious/noExplicitAny: Literally could be any kind of data that needs to be saved
	data: any;
	keyName: string;
}

export default function ToLocalStorage({
	data,
	keyName,
}: ToLocalStorageProps): React.ReactNode {
	const mounted = useRef(false);

	useEffect(() => {
		if (data && !mounted.current) {
			const response = storage.set({ data, keyName });
			mounted.current = response;
		}
	}, [data, keyName]);

	return null;
}
