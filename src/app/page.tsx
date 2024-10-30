import Link from 'next/link';
import useIsLoggedIn from './hooks/useIsLoggedIn';
import useServerCookie from './hooks/useServerCookie';
import { ACCOUNTS, USER } from '@/app/constants';
import type { AccountData, UserData } from './types';
import NextCruft from './components/NextCruft';

export default function Home() {
	const isLoggedIn = useIsLoggedIn();
	const [accountsCookieData] = useServerCookie<AccountData[]>(ACCOUNTS);
	const [userCookieData] = useServerCookie<UserData>(USER);
	const noAccounts =
		Array.isArray(accountsCookieData) && accountsCookieData.length === 0;
	const noCategories =
		typeof userCookieData === 'object' && !userCookieData?.categories;

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

			{isLoggedIn && noAccounts && (
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

			{isLoggedIn && !noAccounts && noCategories && (
				<div className="hero bg-accent">
					<div className="hero-content text-center pb-8">
						<div className="max-w-md">
							<h2>Create Your Categories!</h2>

							<Link href="categories" className="btn btn-primary">
								Go To Categories
							</Link>
						</div>
					</div>
				</div>
			)}

			{isLoggedIn && !noAccounts && !noCategories && (
				<div className="hero bg-accent">
					<div className="hero-content text-center pb-8">
						<div className="max-w-md">
							<h2>Import Your Bank Data!</h2>

							<Link href="csv-upload" className="btn btn-primary">
								Go To CSV Upload
							</Link>
						</div>
					</div>
				</div>
			)}

			{false && <NextCruft />}
		</div>
	);
}
