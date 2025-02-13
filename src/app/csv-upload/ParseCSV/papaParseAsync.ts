import Papa from 'papaparse';
import type { ParsedData } from '../../types/ParseCSV';

export default function papaParseAsync(fileData: File): Promise<ParsedData> {
	return new Promise((resolve, reject) => {
		Papa.parse<string[]>(fileData, {
			complete: ({ data }) => resolve(data),
			error: (err) => reject(err),
		});
	});
}
