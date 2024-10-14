import type { FormattedDataProps } from '.';

export default function getDateScore(
	mapEntries: FormattedDataProps[],
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	rowTimestamp: any,
) {
	const entriesDayjsTS = mapEntries.map((mapEntry) => mapEntry.timestampDayjs);

	console.log({ entriesDayjsTS, rowTimestamp });

	return true;
}
