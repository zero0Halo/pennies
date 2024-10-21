import { cookies } from 'next/headers';
import CreateAccount from './components/CreateAccount';

export default function Accounts() {
	const cookieStore = cookies();
	const userCookie = cookieStore.get('user')?.value ?? '';
	const userData = JSON.parse(userCookie);
	const noAccounts = userData && !userData?.accounts;

	return (
		<section className="container mx-auto pt-4">
			<h1>Accounts</h1>

			{noAccounts && (
				<div className="prose">
					<h2>Create an Account</h2>
					<CreateAccount />
				</div>
			)}
		</section>
	);
}
