export default function getDescriptionScore(
	val1: string[] | string,
	val2: string[] | string,
) {
	const map = new Map();
	const arr1 = Array.isArray(val1)
		? val1
		: val1.split(',').map((m) => m.trim());
	const arr2 = Array.isArray(val2)
		? val2
		: val2.split(',').map((m) => m.trim());
	const maxLength = Math.max(arr1.length, arr2.length);

	let matches = 0;

	arr1.forEach((arrItem) => map.set(arrItem, arrItem));
	arr2.forEach((arrItem) => (map.get(arrItem) ? matches++ : 0));

	return Math.ceil((matches / maxLength) * 100);
}
