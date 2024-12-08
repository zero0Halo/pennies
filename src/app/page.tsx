import NextCruft from './components/NextCruft';
import { useIsLoggedIn, useServerCookie } from '@/app/hooks/server';
import type { AccountData, TransactionWithDateData, UserData } from './types';
import { ACCOUNTS, USER } from '@/app/constants';
import HeroStep from './components/home/HeroStep';
import { apiCall, dateFormat } from '@/utils/app';
import TransactionsMonth from './components/home/TransactionsMonth';

interface GetTransactionsArguments {
	accountsData: AccountData[];
	userData: UserData;
}

type GetTransactionsData = {
	data: TransactionWithDateData[];
	message: string;
};

async function getTransactions({
	accountsData,
	userData,
}: GetTransactionsArguments): Promise<GetTransactionsData | boolean> {
	const today = new Date().toDateString();
	const default_account_uid: string =
		accountsData.find(({ is_default }) => is_default)?.uid ?? '';
	const account_uid: string | false = userData.accounts?.includes(
		default_account_uid,
	)
		? default_account_uid
		: false;
	if (!account_uid) return false;

	const response = await apiCall('/api/transactions/select/by-day', {
		payload: {
			account_uid,
			date: today,
		},
	});

	return response?.error ? false : response;
}

export default async function Home() {
	const isLoggedIn = useIsLoggedIn();
	const [accountsData] = useServerCookie<AccountData[]>(ACCOUNTS);
	const [userData] = useServerCookie<UserData>(USER);
	const noAccounts = Array.isArray(accountsData) && accountsData.length === 0;
	const noCategories = typeof userData === 'object' && !userData?.categories;
	const transactionsResponse: GetTransactionsData | boolean =
		Array.isArray(accountsData) && typeof userData === 'object'
			? await getTransactions({ accountsData, userData })
			: false;

	return (
		<div>
			{typeof transactionsResponse !== 'boolean' && (
				<TransactionsMonth transactionsData={transactionsResponse.data} />
			)}

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
