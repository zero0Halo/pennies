import type { Dayjs } from 'dayjs';
import type React from 'react';

export interface CsvUploadData {
	csvfile: FileList;
}

export interface FormattedRowData {
	amount: number;
	date: string;
	description: string;
	id: string;
	terms: string[];
	timestamp: Dayjs;
}
export type GroupData = {
	description: string;
	id: string;
	name: boolean | string;
	possiblyRecurring: boolean | string;
	prime: FormattedRowData;
	recurring: boolean | string;
	transactions: FormattedRowData[];
};

export type SetEditingFn = (arg: boolean) => void;
export interface SetGroupNameData {
	name: string;
}
