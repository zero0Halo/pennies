import NextCruft from './components/NextCruft';
import HomeHero from './components/home/HomeHero';
import { useIsLoggedIn, useServerCookie } from '@/app/hooks/server';
import {
	validateAccountData,
	validateUserData,
	type AccountData,
	type UserData,
} from '@/app/types';
import { ACCOUNTS, USER } from '@/app/constants';
import { apiCall } from '@/utils/app';

interface GetDataArgs {
	accounts: AccountData[] | boolean | undefined;
	user: UserData | boolean | undefined;
}

async function getData({ accounts, user }: GetDataArgs) {
	const userDataValid: boolean = validateUserData(user);
	const accountsDataValid: boolean = validateAccountData(accounts);

	if (!userDataValid || !accountsDataValid) return null;

	const month = new Date().getMonth() + 1;
	const response = await apiCall('/api/home/select', {
		payload: { accounts, month, user },
	});

	return response;
}

export default async function Home() {
	const isLoggedIn = useIsLoggedIn();
	const [accounts] = useServerCookie<AccountData[]>(ACCOUNTS);
	const [user] = useServerCookie<UserData>(USER);
	const noAccounts = Array.isArray(accounts) && accounts.length === 0;
	const noCategories = typeof user === 'object' && !user?.categories;

	const data = await getData({ accounts, user });
	console.log({ data });
	return (
		<div>
			{/* If the user isn't logged in */}
			{!isLoggedIn && (
				<HomeHero
					heading="Don't Have an Signin?"
					linkText="Signup!"
					linkUrl="signup"
					subHeading="Click the Signup Button Below!"
				/>
			)}

			{/* If there user is logged in but has no accounts */}
			{isLoggedIn && noAccounts && (
				<HomeHero
					heading="You Need An Account To Start Saving Pennies!"
					linkText="Go To Accounts!"
					linkUrl="accounts"
				/>
			)}

			{/* If the user is logged in, has accounts but no categories */}
			{isLoggedIn && !noAccounts && noCategories && (
				<HomeHero
					heading="Create Your Categories!"
					linkText="Go To Categories!"
					linkUrl="categories"
				/>
			)}

			{/* If the user is logged in, has accounts has categories */}
			{isLoggedIn && !noAccounts && !noCategories && (
				<HomeHero
					heading="Import Your Bank Data!"
					linkText="Go To CSV Upload!"
					linkUrl="csv-upload"
				/>
			)}

			{false && <NextCruft />}
		</div>
	);
}
