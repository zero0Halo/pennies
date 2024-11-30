import { cookies } from 'next/headers';
import type { PostgrestError, SupabaseClient } from '@supabase/supabase-js';
import { createServerClient } from '@/utils/supabase';
import { responseError, responseSuccess } from '@/utils/api/responseFactory';
import type { UpsertOptions as UpsertOptionsBase, UserData } from '@/app/types';
import { EQ, FROM, INSERT, SELECT, UPSERT, USER } from '@/app/constants';
import type { NextResponse } from 'next/server';
import { getIsoDate } from './general';

type QueryResponse<T> = { data: T | null; error: PostgrestError | null };
type UpsertOptions = UpsertOptionsBase & {
	revertOnFail: boolean;
};
type SuperiorBaseResponse<T> = {
	data: T | T[] | null;
	error: null | NextResponse;
	success: null | NextResponse;
};

interface SuperiorBaseArgs {
	client: SupabaseClient;
	user_uid: string;
}
type SuperiorBaseMessageData = {
	from: string;
	operation: string;
	payloadSize?: undefined | number;
};

class SuperiorBase {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	private query: any;
	private client: SupabaseClient;
	private messagePieces: SuperiorBaseMessageData;
	private querySteps: string[] = [];
	private use_upsert_check: boolean;
	private use_user_uid: boolean;
	private user_uid: string;

	constructor({ client, user_uid }: SuperiorBaseArgs) {
		this.client = client;
		this.messagePieces = {
			from: '',
			operation: '',
			payloadSize: undefined,
		};
		this.use_upsert_check = true;
		this.use_user_uid = true;
		this.user_uid = user_uid;
	}

	buildMessage({ success = false }: { success: boolean | undefined }): string {
		const { from, operation, payloadSize }: SuperiorBaseMessageData =
			this.messagePieces;

		const message = `Query to ${operation} ${payloadSize ? `${payloadSize} ` : ''}${from} was ${success ? 'successful.' : 'failed.'}`;

		return message;
	}

	eq(field: string, value: string | boolean | number) {
		this.fromCheck();

		this.querySteps.push(EQ);
		this.query = this.query.eq(field, value);
		return this;
	}

	from(table: string) {
		this.querySteps.push(FROM);
		this.querySteps.push(table);
		this.messagePieces.from = table;
		this.query = this.client.from(table); // Start the query
		return this;
	}

	fromCheck() {
		if (!this.query) throw new Error('Call `from()` before chaining queries.');
	}

	insert<T>(data: T, options?: UpsertOptions) {
		this.fromCheck();

		this.querySteps.push(INSERT);
		this.messagePieces.operation = INSERT;
		this.messagePieces.payloadSize = Array.isArray(data) ? data.length : 1;
		this.query = this.query.insert(this.whenUpdated(data), options);
		return this;
	}

	noUserId() {
		this.use_user_uid = false;
		return this;
	}

	select(value: string) {
		this.fromCheck();
		this.messagePieces.operation = SELECT;
		this.querySteps.push(SELECT);
		this.query = this.query.select(value);
		return this;
	}

	single() {
		this.fromCheck();
		this.querySteps.push('single');
		this.query = this.query.single();
		return this;
	}

	whenUpdated<T>(data: T): T | T[] | null {
		const updated = getIsoDate();
		if (!Array.isArray(data)) return { ...data, updated };

		return Array.isArray(data) ? data.map((d) => ({ ...d, updated })) : null;
	}

	upsert<T>(data: T, options?: UpsertOptions) {
		this.fromCheck();

		this.querySteps.push(UPSERT);
		this.messagePieces.operation = UPSERT;
		this.messagePieces.payloadSize = Array.isArray(data) ? data.length : 1;
		this.query = this.query.upsert(this.whenUpdated(data), options);
		return this;
	}

	async go<T>(): Promise<SuperiorBaseResponse<T>> {
		this.fromCheck();

		const {
			messagePieces: { operation, payloadSize },
			use_upsert_check,
			user_uid,
			use_user_uid,
		} = this;
		const query = use_user_uid
			? this.query.eq('user_uid', user_uid)
			: this.query;

		const { data, error }: QueryResponse<T> = await query; // Execute the supabase query

		// TODO: NEED TO ACTUALLY ROLLBACK THE UPSERT AND NOT JUST THROW AN ERROR
		if (
			data &&
			Array.isArray(data) &&
			use_upsert_check &&
			operation === UPSERT &&
			payloadSize !== data.length
		) {
			return {
				data: null,
				error: responseError?.('Upsert payload sizes do not match', error),
				success: null,
			};
		}

		if (data)
			return {
				data,
				error: null,
				success: responseSuccess?.(this.buildMessage({ success: true }), data),
			};

		if (error)
			return {
				data: null,
				error: responseError?.(this.buildMessage({ success: false }), error),
				success: null,
			};

		return { data, error, success: null };
	}
}

export default async function superiorBaseFactory(
	supabase?: SupabaseClient,
): Promise<SuperiorBase> {
	const cookieStore = cookies();
	const client = supabase ?? createServerClient(cookieStore);
	const user_uid = (JSON.parse(cookieStore.get(USER)?.value ?? '') as UserData)
		?.uid;

	return new SuperiorBase({ client, user_uid });
}
