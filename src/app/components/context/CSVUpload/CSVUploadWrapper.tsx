'use client';

import type React from 'react';
import CSVUploadProvider from './CSVUploadProvider';

export default function FormMessagingWrapper({
	children,
}: { children: React.ReactNode }) {
	return <CSVUploadProvider>{children}</CSVUploadProvider>;
}
