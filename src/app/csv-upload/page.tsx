import { redirect } from 'next/navigation';
import CsvUpload from './CsvUpload';
import { useIsLoggedIn } from '@/app/hooks/server';

export default function CsvUploadPage() {
	const isLoggedIn = useIsLoggedIn();

	if (!isLoggedIn) redirect('/');

	return (
		<div>
			<h2>CSV Upload</h2>

			<CsvUpload />
		</div>
	);
}
