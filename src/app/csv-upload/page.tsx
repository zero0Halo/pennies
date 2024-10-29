import useIsLoggedIn from '@/app/hooks/useIsLoggedIn';
import CsvUpload from './components/CsvUpload';
import { redirect } from 'next/navigation';

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
