import dayjs from 'dayjs';

export default function dateFormat(date: string): string {
	return dayjs(date).format('MM-DD-YYYY');
}
