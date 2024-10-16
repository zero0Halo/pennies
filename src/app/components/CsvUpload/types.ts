import type { Dayjs } from 'dayjs';

export interface CsvUploadProps {
	csvfile: FileList;
}

export interface FormattedDataProps {
	amount: number;
	date: string;
	description: string;
	id: string;
	terms: string[];
	timestamp: Dayjs;
}
export interface FindGroupsProps {
	description: string;
	id: string;
	prime: FormattedDataProps;
	recurring: boolean;
	transactions: FormattedDataProps[];
}
