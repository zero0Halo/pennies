import { createBrowserClient as createBrowserClientFn } from '@supabase/ssr';

const createBrowserClient = () =>
	createBrowserClientFn(
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
	);

export default createBrowserClient;
