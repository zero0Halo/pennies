export default function getDescriptionScore(arr1: string[], arr2: string[]) {
	const map = new Map();
	const maxLength = Math.max(arr1.length, arr2.length);

	let matches = 0;

	arr1.forEach((arrItem) => map.set(arrItem, arrItem));
	arr2.forEach((arrItem) => (map.get(arrItem) ? matches++ : 0));

	return Math.ceil((matches / maxLength) * 100);
}
