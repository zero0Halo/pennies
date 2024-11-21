import NextCruft from './components/NextCruft';
import HomeHero from './components/home/HomeHero';
import { useIsLoggedIn, useServerCookie } from '@/app/hooks/server';
import {
	validateAccountData,
	validateUserData,
	type AccountData,
	type ReturnData,
	type UserData,
} from '@/app/types';
import { ACCOUNTS, USER } from '@/app/constants';
import { fakePromise } from '@/utils/api';

interface GetDataArgs {
	accountsData: AccountData[] | boolean | undefined;
	userData: UserData | boolean | undefined;
}

async function getData({
	accountsData,
	userData,
}: GetDataArgs): Promise<ReturnData | null> {
	const userDataValid: boolean = validateUserData(userData);
	const accountsDataValid: boolean = validateAccountData(accountsData);

	if (!userDataValid || !accountsDataValid) return fakePromise(null);

	const defaultAccount = !Array.isArray(accountsData)
		? undefined
		: accountsData.find((account) => account.is_default);
	const user_uid = !userDataValid ? undefined : (userData as UserData).uid;
	const thisMonth: number = new Date().getMonth() + 1;
	const data = fetch('/api/home/select');

	return fakePromise(null);
}

export default async function Home() {
	const isLoggedIn = useIsLoggedIn();
	const [accountsData] = useServerCookie<AccountData[]>(ACCOUNTS);
	const [userData] = useServerCookie<UserData>(USER);
	const noAccounts = Array.isArray(accountsData) && accountsData.length === 0;
	const noCategories = typeof userData === 'object' && !userData?.categories;

	const data = await getData({ accountsData, userData });

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
