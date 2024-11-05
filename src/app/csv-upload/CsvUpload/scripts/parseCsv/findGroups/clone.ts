import dayjs, { isDayjs } from 'dayjs';

interface ClonedObject {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	[key: string]: any;
}

export default function clone(obj: object) {
	const newObj: ClonedObject = {};

	Object.entries(obj).forEach(([key, value]) => {
		newObj[key] = Array.isArray(value)
			? value.slice()
			: isDayjs(value)
				? dayjs(value)
				: value;
	});

	return newObj;
}
