// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export default function fakePromise(data: any) {
	return new Promise((resolve) => resolve(data));
}
