import { useIsLoggedIn } from '@/app/hooks/server';
import type {
	AccountData,
	MonthlySumData,
	TransactionWithDateData,
	UserData,
} from './types';
import { MONTHLY_SUMS } from '@/app/constants';
import HeroStep from './components/home/HeroStep';
import { apiCall } from '@/utils/app';
import useAccountsCookie from './hooks/useAccountsCookie/server';
import ToLocalStorage from './components/ToLocalStorage';
import useUserCookie from './hooks/useUserCookie/server';
import HomepageViews from './components/home/HomepageViews';

interface GetInitialDataArguments {
	defaultAccount: AccountData | null;
	defaultDate: string;
	user: UserData | null;
}

async function getInitialData({
	defaultAccount,
	defaultDate,
	user,
}: GetInitialDataArguments): Promise<{
	monthlySums: MonthlySumData[] | null;
	transactions: TransactionWithDateData[] | null;
}> {
	const response = { monthlySums: null, transactions: null };

	if (defaultAccount === null || user === null) return response;

	const accountCheck = user.accounts?.includes(defaultAccount.uid) ?? false;

	if (!accountCheck) return response;

	const transactionResponse = await apiCall<TransactionWithDateData[]>(
		'/api/transactions/select/by-day',
		{
			payload: {
				account_uid: defaultAccount.uid,
				date: defaultDate,
			},
		},
	);

	const monthlySumResponse = await apiCall<MonthlySumData[]>(
		'/api/monthly_sums/select',
		{
			payload: {
				account_uid: defaultAccount.uid,
				user_uid: user.uid,
			},
		},
	);

	if (transactionResponse.error || monthlySumResponse.error) return response;

	return {
		monthlySums: monthlySumResponse.data,
		transactions: transactionResponse.data,
	};
}

// COMPONENT
export default async function Home() {
	// CUSTOM HOOKS
	const isLoggedIn = useIsLoggedIn();
	const { defaultAccount, noAccounts } = useAccountsCookie();
	const { categories, user } = useUserCookie();

	// SHUGAH
	const defaultDate = new Date().toDateString();

	// DATA CALL
	const {
		monthlySums,
		transactions,
	}: {
		monthlySums: MonthlySumData[] | null;
		transactions: TransactionWithDateData[] | null;
	} = await getInitialData({
		defaultAccount,
		defaultDate,
		user,
	});

	// JSX
	return (
		<div className="px-4">
			{monthlySums && (
				<ToLocalStorage data={monthlySums} keyName={MONTHLY_SUMS} />
			)}

			{/* Logged in, show transactions */}
			{transactions !== null && isLoggedIn && (
				<HomepageViews
					defaultAccount={defaultAccount}
					defaultDate={defaultDate}
					defaultMonthlySums={monthlySums}
					defaultTransactionsData={transactions}
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
			{isLoggedIn && !noAccounts && !categories && (
				<HeroStep
					link="categories"
					linkText="Go To Categories"
					title="Create Your Categories!"
				/>
			)}

			{/* Logged in, has accounts, has categories, but no valid call to get transactions */}
			{isLoggedIn &&
				!noAccounts &&
				categories &&
				transactions === null && (
					<HeroStep
						link="csv-upload"
						linkText="Go To CSV Upload"
						title="Import Your Bank Data!"
					/>
				)}
		</div>
	);
}
