import type { PostgrestError, SupabaseClient } from '@supabase/supabase-js';
import { createBrowserClient, createServerClient } from '@/utils/supabase';
import type { NextResponse } from 'next/server';
import type { Data } from '@/utils/api/responseFactory';
import { CLIENT, SERVER } from '@/app/constants';
import type { UpsertOptions as UpsertOptionsBase } from '@/app/types';

let nextHeaders: typeof import('next/headers');

type BrowserReturn = {
	data: null | object | string;
	error: null | object | string;
};
type DynamicResponse =
	| BrowserReturn
	| [
			(message: string, data: Data) => NextResponse,
			(message: string, data: Data) => NextResponse,
	  ];
type QueryResponse<T> = { data: T | null; error: PostgrestError | null };
type UpsertOptions = UpsertOptionsBase & {
	revertOnFail: boolean;
};

class SuperiorBase {
	private supabase: SupabaseClient;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	private query: any;
	private querySteps: string[] = [];
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	private payload?: any;
	private errorFn?: (arg: string) => void;
	private response: DynamicResponse;
	private successFn?: (arg: string) => void;
	private type: string;

	constructor(
		supabase: SupabaseClient,
		response: DynamicResponse,
		type: string,
	) {
		this.response = response;
		this.supabase = supabase;
		this.type = type;
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

	upsert<T>(data: T, options?: UpsertOptions) {
		this.fromCheck();

		this.querySteps.push('upsert');
		this.query = this.query.select(data, options);
		this.payload = data;
		return this;
	}

	// Must be called to make the query execute. It's not in alpha. order because it's the last step.
	async go<T>() {
		this.fromCheck(); // Throw an error if this.from wasn't called first

		const { errorFn, payload, query, querySteps, response, successFn, type } =
			this;
		const isUpsert = querySteps.includes('upsert');
		const { data, error }: QueryResponse<T> = await query; // Execute the supabase query

		if (type === CLIENT) {
			if (data) {
				successFn?.('Successful Operation');
				return { ...response, data };
			}
			if (error) {
				errorFn?.(`Unsuccessful Operation: ${error.message}`);
				return { ...response, error };
			}
		}

		if (type === SERVER) {
			const [responseSuccess, responseError] = Array.isArray(response)
				? response
				: [];

			if (data)
				return {
					data: responseSuccess?.('Successful Operation', data),
					error: null,
				};

			if (error)
				return {
					data: null,
					error: responseError?.('Error performing operation', error),
				};
		}

		return { data, error };
	}
}

export default async function superiorBaseFactory(
	supabase?: SupabaseClient,
): Promise<SuperiorBase> {
	let client: SupabaseClient | undefined = supabase;
	let response: DynamicResponse = { data: null, error: null };
	let type: string = CLIENT;

	if (typeof window === 'undefined') {
		nextHeaders = await import('next/headers');
		const { responseSuccess, responseError } = await import(
			'@/utils/api/responseFactory'
		);
		const { cookies } = nextHeaders;
		const cookieStore = cookies();
		client = client ?? createServerClient(cookieStore);
		response = [responseSuccess, responseError];
		type = SERVER;
	} else {
		client = client ?? createBrowserClient();
	}

	return new SuperiorBase(client, response, type);
}
