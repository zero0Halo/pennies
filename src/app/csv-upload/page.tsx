import { redirect } from 'next/navigation';
import CsvUpload from './CsvUpload';
import { useIsLoggedIn } from '@/app/hooks/server';
import { FormMessagingWrapper } from '../components/FormMessaging';

export default function CsvUploadPage() {
	const isLoggedIn = useIsLoggedIn();

	if (!isLoggedIn) redirect('/');

	return (
		<div>
			<h2>CSV Upload</h2>
			<FormMessagingWrapper>
				<CsvUpload />
			</FormMessagingWrapper>
		</div>
	);
}
