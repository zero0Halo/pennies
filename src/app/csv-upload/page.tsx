import { redirect } from 'next/navigation';
import {
	CSVUpload,
	CSVUploadWrapper,
} from '@/app/components/context/CSVUpload';
import { useIsLoggedIn } from '@/app/hooks/server';
import { FormMessagingWrapper } from '../components/context/FormMessaging';

export default function CsvUploadPage() {
	const isLoggedIn = useIsLoggedIn();

	if (!isLoggedIn) redirect('/');

	return (
		<div>
			<h2>CSV Upload</h2>
			<FormMessagingWrapper>
				<CSVUploadWrapper>
					<CSVUpload />
				</CSVUploadWrapper>
			</FormMessagingWrapper>
		</div>
	);
}
