import type { Dayjs } from 'dayjs';
import type { FormattedDataProps } from '.';

export default function getDateScore(
	mapValue: FormattedDataProps[],
	timestamp: Dayjs,
) {
	const entryTimestamps = mapValue.map((mapValue) => mapValue.timestamp);

	console.log({ entryTimestamps, timestamp });

	return true;
}
