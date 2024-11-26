import type { NextResponse } from 'next/server';
import type { PostgrestError, SupabaseClient } from '@supabase/supabase-js';
import { createBrowserClient, createServerClient } from '@/utils/supabase';
import type { Data } from '@/utils/api/responseFactory';
import type { UpsertOptions as UpsertOptionsBase, UserData } from '@/app/types';
import { CLIENT, SERVER, USER } from '@/app/constants';
import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import type Cookies from 'js-cookie';

let nextHeaders: typeof import('next/headers');

type BrowserReturn = {
	data: null | object | string;
	error: null | object | string;
};
type CookieStore = typeof Cookies | ReadonlyRequestCookies;
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

interface SuperiorBaseArgs {
	client: SupabaseClient;
	response: DynamicResponse;
	type: string;
	user_uid: string;
}

class SuperiorBase {
	private client: SupabaseClient;
	private errorFn?: (arg: string) => void;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	private query: any;
	private querySteps: string[] = [];
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	private payload?: any;
	private reloadPath?: string;
	private response: DynamicResponse;
	private successFn?: (arg: string) => void;
	private type: string;
	private use_user_uid: boolean;
	private user_uid: string;

	constructor({ client, response, type, user_uid }: SuperiorBaseArgs) {
		this.client = client;
		this.reloadPath = undefined;
		this.response = response;
		this.type = type;
		this.use_user_uid = true;
		this.user_uid = user_uid;
	}

	eq(field: string, value: string | boolean | number) {
		this.fromCheck();

		this.querySteps.push('eq');
		this.query = this.query.eq(field, value);
		return this;
	}

	from(table: string) {
		this.querySteps.push('from');
		this.query = this.client.from(table); // Start the query
		return this;
	}

	fromCheck() {
		if (!this.query) throw new Error('Call `from()` before chaining queries.');
	}

	noUserId() {
		this.use_user_uid = false;
		return this;
	}

	onError(fn: (arg: string) => void) {
		this.errorFn = fn;
		return this;
	}

	onSuccess(fn: (arg: string) => void) {
		this.successFn = fn;
		return this;
	}

	reload(reloadPath: string) {
		this.reloadPath = reloadPath;
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

	// Must be called to make the query execute. It's not in alpha-order because it's the last step.
	async go<T>() {
		this.fromCheck(); // Throw an error if this.from wasn't called first

		const {
			errorFn,
			reloadPath,
			response,
			successFn,
			type,
			user_uid,
			use_user_uid,
		} = this;
		const query = use_user_uid
			? this.query.eq('user_uid', user_uid)
			: this.query;

		const { data, error }: QueryResponse<T> = await query; // Execute the supabase query

		if (type === CLIENT) {
			if (data) {
				successFn?.('Successful Operation');

				if (reloadPath) {
					setTimeout(() => {
						window.location.href = reloadPath;
					}, 2500);
				}

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
	let cookieStore: CookieStore;
	let client: SupabaseClient | undefined = supabase;
	let response: DynamicResponse = { data: null, error: null };
	let type: string = CLIENT;
	let user_uid = '';

	if (typeof window === 'undefined') {
		nextHeaders = await import('next/headers');
		const { responseSuccess, responseError } = await import(
			'@/utils/api/responseFactory'
		);
		const { cookies } = nextHeaders;
		cookieStore = cookies();
		client = client ?? createServerClient(cookieStore);
		response = [responseSuccess, responseError];
		type = SERVER;
		user_uid = (JSON.parse(cookieStore.get(USER)?.value ?? '') as UserData)
			?.uid;
	} else {
		client = client ?? createBrowserClient();
		cookieStore = ((await import('js-cookie')) as typeof import('js-cookie'))
			?.default;
		user_uid = (JSON.parse(cookieStore.get(USER) ?? '') as UserData)?.uid;
	}

	return new SuperiorBase({ client, response, type, user_uid });
}
