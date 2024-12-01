import NextCruft from './components/NextCruft';
import { useIsLoggedIn, useServerCookie } from '@/app/hooks/server';
import type { AccountData, UserData } from './types';
import { ACCOUNTS, USER } from '@/app/constants';
import HeroStep from './components/home/HeroStep';

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
			{/* If not logged in */}
			{!isLoggedIn && (
				<HeroStep
					link="signup"
					linkText="Signup!"
					subTitle="Click the Signup button below!"
					title="Don't have a signin?"
				/>
			)}

			{/* Logged in, but no accounts */}
			{isLoggedIn && noAccounts && (
				<HeroStep
					link="accounts"
					linkText="Go To Accounts"
					title="You Need An Account To Start Saving Pennies!"
				/>
			)}

			{/* Logged in, has accounts but no categories */}
			{isLoggedIn && !noAccounts && noCategories && (
				<HeroStep
					link="categories"
					linkText="Go To Categories"
					title="Create Your Categories!"
				/>
			)}

			{/* Logged in, has accounts, has categories */}
			{isLoggedIn && !noAccounts && !noCategories && (
				<HeroStep
					link="csv-upload"
					linkText="Go To CSV Upload"
					title="Import Your Bank Data!"
				/>
			)}

			{false && <NextCruft />}
		</div>
	);
}
