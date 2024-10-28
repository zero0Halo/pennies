import Link from 'next/link';
import useIsLoggedIn from './hooks/useIsLoggedIn';
import useServerCookie from './hooks/useServerCookie';
import { ACCOUNTS } from '@/app/constants';
import type { AccountData } from './types';
import NextCruft from './components/NextCruft';

export default function Home() {
	const isLoggedIn = useIsLoggedIn();
	const [accountsCookieData] = useServerCookie<AccountData[]>(ACCOUNTS);
	const noAccounts =
		Array.isArray(accountsCookieData) && accountsCookieData.length === 0;

	return (
		<div>
			{!isLoggedIn && (
				<div className="hero bg-accent">
					<div className="hero-content text-center pb-8">
						<div className="max-w-md">
							<h2>Don't Have an Signin?</h2>
							<h3>Click the Signup Button Below!</h3>

							<Link href="signup" className="btn btn-primary">
								Signup!
							</Link>
						</div>
					</div>
				</div>
			)}

			{noAccounts && isLoggedIn && (
				<div className="hero bg-accent">
					<div className="hero-content text-center pb-8">
						<div className="max-w-md">
							<h2>You Need An Account To Start Saving Pennies!</h2>

							<Link href="accounts" className="btn btn-primary">
								Go To Accounts
							</Link>
						</div>
					</div>
				</div>
			)}

			{isLoggedIn && !noAccounts && (
				<div className="hero bg-accent">
					<div className="hero-content text-center pb-8">
						<div className="max-w-md">
							<h2>Import Your Bank Data!</h2>

							<Link href="csv-upload" className="btn btn-primary">
								Go To CSV Upload
							</Link>
						</div>
					</div>
				</div>)}

			{false && <NextCruft />}
		</div>
	);
}
