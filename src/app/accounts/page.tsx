import { cookies } from 'next/headers';
import AccountCreate from './components/AccountCreate';

export default function Accounts() {
	const cookieStore = cookies();
	const userCookie = cookieStore.get('user')?.value ?? '';
	const userData = userCookie.length ? JSON.parse(userCookie) : false;
	const noAccounts = userData && !userData?.accounts;

	console.log(userData);

	return (
		<section className="container mx-auto pt-4">
			<h1>Accounts</h1>

			{noAccounts && (
				<div className="prose">
					<h2>Create an Account</h2>
					<AccountCreate />
				</div>
			)}
		</section>
	);
}
