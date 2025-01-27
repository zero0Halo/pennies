'use client';

import type React from 'react';
import FormMessagingProvider from './FormMessagingProvider';

export default function FormMessagingWrapper({
	children,
}: { children: React.ReactNode }) {
	return <FormMessagingProvider>{children}</FormMessagingProvider>;
}
