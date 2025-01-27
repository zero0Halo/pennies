// src/app/api/transactions/select/by-day
import dayjs from 'dayjs';
import { responseSuccess } from '@/utils/api/responseFactory';
import superiorBaseFactory from '@/utils/superiorBaseFactory';
import type {
	TransactionDateMetaData,
	TransactionGroupByDayData,
	TransactionWithDateData,
	TransactionWithGroupData,
} from '@/app/types';
import { TRANSACTIONS_WITH_GROUP } from '@/app/constants';

export async function POST(req: Request) {
	const { account_uid, date } = await req.json();
	const startDate = dayjs(date).startOf('month').toISOString();
	const endDate = dayjs(date).endOf('month').toISOString();
	const superiorBase = await superiorBaseFactory();

	console.log({ account_uid, date });

	// Get transactions for the specified month
	const { data: transactionsData, error: transactionsDataError } =
		await superiorBase
			.from(TRANSACTIONS_WITH_GROUP)
			.select('*')
			.eq('account_uid', account_uid)
			.gte('timestamp', startDate)
			.lt('timestamp', endDate)
			.order('timestamp')
			.go<TransactionWithGroupData[]>();
	if (
		transactionsData === null ||
		transactionsDataError ||
		!Array.isArray(transactionsData)
	)
		return transactionsDataError;

	// const transactionsData = _transactionsData as TransactionWithGroupData[];
	// const transactionsData = _transactionsData;

	// Group the transactions by day
	const byDay: TransactionGroupByDayData = transactionsData.reduce(
		(acc, current) => {
			const day = +dayjs(current.timestamp).date();

			if (!Object.hasOwn(acc, day)) {
				acc[day] = [current];
			} else {
				acc[day].push(current);
			}

			return acc;
		},
		{} as TransactionGroupByDayData,
	);

	// Convert data to an array for easier mapping, add in a bit of metadata
	const byDayArray: TransactionWithDateData[] = Object.entries(byDay)
		.map((m) => {
			const dayMeta: TransactionDateMetaData = {
				date: +m[0],
				day: dayjs(m[1][0].timestamp).format('ddd'),
				isToday: +dayjs(date).date() === +m[0],
			};
			return [dayMeta, m[1]] as [
				TransactionDateMetaData,
				TransactionWithGroupData[],
			];
		})
		.sort((a, b) => {
			return a[0].date - b[0].date;
		});

	return responseSuccess({
		message: 'Successfully retrieved transactions!',
		data: byDayArray,
	});
}
