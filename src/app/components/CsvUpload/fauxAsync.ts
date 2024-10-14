import Papa from 'papaparse';

export default function fauxAsync(fileData: File): Promise<string[][]> {
	return new Promise((resolve, reject) => {
		return Papa.parse<string[]>(fileData, {
			complete: ({ data }) => resolve(data),
			error: (err) => reject(err),
		});
	});
}
