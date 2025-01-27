'use client';

import type {
	TransactionData,
	TransactionWithDateData,
	TransactionWithGroupData,
} from '@/app/types';
import type React from 'react';
import {
	createContext,
	useCallback,
	useContext,
	useState,
	type ReactNode,
} from 'react';

// Define the shape of the context
export interface TransactionsMonthContextData {
	transactions: TransactionWithDateData[] | undefined;
	setTransactions: (arg: TransactionWithDateData[]) => void;
}

// Create the context with a default value
export const TransactionsMonthContext = createContext<
	TransactionsMonthContextData | undefined
>(undefined);

// Create a provider component
interface TransactionsMonthProviderProps {
	children: ReactNode;
}

const TransactionsMonthProvider: React.FC<TransactionsMonthProviderProps> = ({
	children,
}) => {
	const [transactions, setTransactions] = useState<
		TransactionWithDateData[] | undefined
	>(undefined);

	return (
		<TransactionsMonthContext.Provider
			value={{ transactions, setTransactions }}
		>
			{children}
		</TransactionsMonthContext.Provider>
	);
};

export default TransactionsMonthProvider;

export const useTransactionsMonthContext = (): TransactionsMonthContextData => {
	const context = useContext(TransactionsMonthContext);
	if (!context) {
		throw new Error(
			'useTransactionsMonthContext must be used within a TransactionsMonthProvider',
		);
	}
	return context;
};
