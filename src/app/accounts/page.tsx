import AccountCreate from './components/AccountCreate';
import useServerCookie from '../hooks/useServerCookie';
import { USER } from '@/app/constants';
import type { UserData } from '../types';

export default function Accounts() {
	const [userData, userDataValid] = useServerCookie<UserData>(USER);
	const noAccounts = userDataValid && !(userData as UserData)?.accounts;

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
