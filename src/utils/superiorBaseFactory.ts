import type { SupabaseClient } from '@supabase/supabase-js';
import { createBrowserClient, createServerClient } from '@/utils/supabase';

let nextHeaders: typeof import('next/headers');

class SuperiorBase {
	private supabase: SupabaseClient;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	private query: any;
	private querySteps: string[] = [];
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	private payload?: any;
	private errorFn?: (arg: string) => void;
	private successFn?: (arg: string) => void;

	constructor(supabase: SupabaseClient) {
		this.supabase = supabase;
	}

	eq(field: string, value: string | boolean | number) {
		this.fromCheck();

		this.querySteps.push('eq');
		this.query = this.query.eq(field, value);
		return this;
	}

	from(table: string) {
		this.querySteps.push('from');
		this.query = this.supabase.from(table); // Start the query
		return this;
	}

	fromCheck() {
		if (!this.query) throw new Error('Call `from()` before chaining queries.');
	}

	onError(fn: (arg: string) => void) {
		this.errorFn = fn;
		return this;
	}

	onSuccess(fn: (arg: string) => void) {
		this.successFn = fn;
		return this;
	}

	select(value: string) {
		this.fromCheck();

		this.querySteps.push('select');
		this.query = this.query.select(value);
		return this;
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	upsert(data: any, options?: any | undefined) {
		this.fromCheck();

		this.querySteps.push('upsert');
		this.query = this.query.select(data, options);
		this.payload = data;
		return this;
	}

	// This must be called to make the query execute. It's not in alpha. order because it's the last step.
	async go() {
		this.fromCheck();

		this.querySteps = [];

		const { data, error } = await this.query;
		const isUpsert = this.querySteps.includes('upsert');

		if (isUpsert && data.length !== this.payload.length) {
			this.errorFn?.(
				'The length of the success data does not match the length of the original payload',
			);
		}

		if (data) this.successFn?.(data);
		if (error) this.errorFn?.(error);

		return { data, error };
	}
}

export default async function superiorBaseFactory(
	supabase?: SupabaseClient,
): Promise<SuperiorBase> {
	let client: SupabaseClient | undefined = supabase;

	if (typeof window === 'undefined' && !client) {
		nextHeaders = await import('next/headers');
		const { cookies } = nextHeaders;
		const cookieStore = cookies();
		client = createServerClient(cookieStore);
	} else if (!client) {
		client = createBrowserClient();
	}

	return new SuperiorBase(client);
}
