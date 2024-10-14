export default function getDescriptionScore(arr1: string[], arr2: string[]) {
	const map = new Map();
	const blacklist = ['steve', 'swanson'];
	let matches = 0;
	arr1.forEach((arrItem) =>
		!blacklist.includes(arrItem) ? map.set(arrItem, arrItem) : false,
	);
	arr2.forEach((arrItem) => (map.get(arrItem) ? matches++ : 0));
	return {
		sm: matches === 2,
		md: matches === 3,
		lg: matches === 4,
		xl: matches > 4,
	};
}
