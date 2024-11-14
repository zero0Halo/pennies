import responseFactory from '@/utils/utils/responseFactory';

export default function alphaSort(arr: string[] | null) {
	if (!Array.isArray(arr))
		return responseFactory('Argument supplied to alphaSort is not an array');

	const strCheck = arr.reduce(
		(acc, current) => acc + +(typeof current !== 'string'),
		0,
	);
	if (strCheck !== 0)
		return responseFactory(
			`All array elements must be strings but ${strCheck} were not`,
			{ array: arr },
		);

	const sortFn = (a: string, b: string) => {
		const aLower = a.toLowerCase();
		const bLower = b.toLowerCase();

		return aLower.localeCompare(bLower);
	};

	return arr.slice().sort(sortFn);
}
