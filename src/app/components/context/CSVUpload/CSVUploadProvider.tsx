'use client';

import type { ParseCSVData } from '@/app/types';
import type React from 'react';
import { createContext, useContext, useState, type ReactNode } from 'react';

// Define the shape of the context
export interface CSVUploadContextData {
	CSVData: ParseCSVData | undefined;
	setCSVData:
		| React.Dispatch<React.SetStateAction<ParseCSVData | undefined>>
		| undefined;
}

// Create the context with a default value
export const CSVUploadContext = createContext<CSVUploadContextData | undefined>(
	undefined,
);

// Create a provider component
interface CSVUploadProps {
	children: ReactNode;
}

const CSVUploadProvider: React.FC<CSVUploadProps> = ({ children }) => {
	const [CSVData, setCSVData] = useState<ParseCSVData | undefined>();

	return (
		<CSVUploadContext.Provider value={{ CSVData, setCSVData }}>
			{children}
		</CSVUploadContext.Provider>
	);
};

export default CSVUploadProvider;

export const useCSVUploadContext = (): CSVUploadContextData => {
	const context = useContext(CSVUploadContext);
	if (!context) {
		return { CSVData: undefined, setCSVData: undefined };
	}
	return context;
};
