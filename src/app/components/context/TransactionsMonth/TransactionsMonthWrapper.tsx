'use client';

import type React from 'react';
import TransactionsMonthProvider from './TransactionsMonthProvider';

export default function FormMessagingWrapper({
	children,
}: { children: React.ReactNode }) {
	return <TransactionsMonthProvider>{children}</TransactionsMonthProvider>;
}
