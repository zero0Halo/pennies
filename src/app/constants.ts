import dayjs from 'dayjs';

export const ACCOUNTS = 'accounts';
export const BIWEEKLY = 'BiWeekly';
export const CAR = 'Car';
export const CHECKING = 'Checking';
export const CLIENT = 'CLIENT';
export const CREATE = 'create';
export const CREDIT_CARD = 'Credit Card';
export const CSV_UPLOAD = 'csv-upload';
export const DELETE = 'delete';
export const EDIT = 'edit';
export const EQ = 'eq';
export const FAST_FOOD = 'Fast food';
export const FOOD_DELIVERY = 'Food delivery';
export const FROM = 'from';
export const GIFT = 'Gift';
export const GROCERIES = 'Groceries';
export const GROUPS = 'groups';
export const HEALTH = 'Health';
export const INCOME = 'Income';
export const INSERT = 'insert';
export const INVESTMENT = 'Investment';
export const IS_LOGGED_IN = 'isLoggedIn';
export const KIDS = 'Kids';
export const MONTHLY = 'Monthly';
export const MONTHLY_SUMS = 'monthly_sums';
export const MORTGAGE = 'Mortgage';
export const NONE = 'none';
export const NOT_RECURRING = 'notRecurring';
export const ONLINE_SUBSCRIPTION = 'Online subscription';
export const POSSIBLY_RECURRING = 'possiblyRecurring';
export const RECURRING = 'recurring';
export const SAVINGS = 'Savings';
export const SELECT = 'select';
export const SERVER = 'SERVER';
export const TRANSACTIONS = 'transactions';
export const TRANSFER = 'Transfer';
export const TRANSFERS = 'transfers';
export const UPDATE = 'update';
export const UPSERT = 'upsert';
export const USER = 'user';
export const USERS = 'users';
export const UTILITY = 'Utility';
export const WEEKLY = 'Weekly';

// Arrays of options
export const accountTypes = [CHECKING, CREDIT_CARD, INVESTMENT, SAVINGS];
export const defaultCategories = [
	CAR,
	FAST_FOOD,
	FOOD_DELIVERY,
	GIFT,
	GROCERIES,
	HEALTH,
	INCOME,
	INVESTMENT,
	KIDS,
	MORTGAGE,
	ONLINE_SUBSCRIPTION,
	TRANSFER,
	UTILITY,
];
export const MONTHS = [...new Array(12)].map((_, i) =>
	dayjs(`${i + 1}-01-2019`).format('MMMM'),
);
export const YEARS = [...new Array(20)].map((_, i) => `${i + 2020}`);
