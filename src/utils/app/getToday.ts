import { MONTHS } from '@/app/constants';
import dayjs from 'dayjs';
import { getIsoDate } from '../general';

export type GetTodayData = {
	date: number;
	month: number;
	monthName: string;
	timestamp: string;
	year: number;
};

export default function getToday(): GetTodayData {
	const arr = dayjs()
		.format('D MM YYYY')
		.split(' ')
		.map((m) => +m);

	const timestamp = getIsoDate(dayjs().format('MM-DD-YYYY'));
	return {
		date: arr[0],
		month: arr[1] - 1,
		monthName: MONTHS[arr[1] - 1],
		timestamp,
		year: arr[2],
	};
}
