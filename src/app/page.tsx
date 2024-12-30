import { useIsLoggedIn, useServerCookie } from '@/app/hooks/server';
import type { AccountData, TransactionWithDateData, UserData } from './types';
import { USER } from '@/app/constants';
import HeroStep from './components/home/HeroStep';
import { apiCall } from '@/utils/app';
import TransactionsMonth from './components/home/TransactionsMonth';
import useAccounts from './hooks/server/useAccounts';

interface GetTransactionsArguments {
	defaultAccount: AccountData | undefined;
	defaultDate: string;
	userData: UserData | undefined | boolean;
}

type GetTransactionsData = {
	data: TransactionWithDateData[];
	error: string | null;
	message: string;
};

async function getTransactions({
	defaultAccount,
	defaultDate,
	userData,
}: GetTransactionsArguments): Promise<GetTransactionsData | boolean> {
	if (typeof defaultAccount !== 'object' || typeof userData !== 'object')
		return false;

	const accountCheck: boolean = userData?.accounts
		? userData.accounts.includes(defaultAccount.uid)
		: false;
	if (!accountCheck) return false;

	const response: GetTransactionsData = await apiCall(
		'/api/transactions/select/by-day',
		{
			payload: {
				account_uid: defaultAccount.uid,
				date: defaultDate,
			},
		},
	);

	return response?.error ? false : response;
}

// COMPONENT
export default async function Home() {
	// CUSTOM HOOKS
	const isLoggedIn = useIsLoggedIn();
	const { defaultAccount, noAccounts } = useAccounts();
	const [userData] = useServerCookie<UserData>(USER);

	// SHUGAH
	const noCategories = typeof userData === 'object' && !userData?.categories;
	const defaultDate = new Date().toDateString();

	// DATA CALL
	const transactionsResponse: GetTransactionsData | boolean =
		await getTransactions({ defaultAccount, defaultDate, userData });

	// JSX
	return (
		<div>
			{/* Logged in, show transactions */}
			{typeof transactionsResponse !== 'boolean' && isLoggedIn && (
				<TransactionsMonth
					defaultAccount={defaultAccount}
					defaultDate={defaultDate}
					defaultTransactionsData={transactionsResponse.data}
				/>
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

			{/* Logged in, has accounts, has categories, but no valid call to get transactions */}
			{isLoggedIn &&
				!noAccounts &&
				!noCategories &&
				typeof transactionsResponse === 'boolean' && (
					<HeroStep
						link="csv-upload"
						linkText="Go To CSV Upload"
						title="Import Your Bank Data!"
					/>
				)}
		</div>
	);
}
