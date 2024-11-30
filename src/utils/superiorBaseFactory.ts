import { cookies } from 'next/headers';
import type { PostgrestError, SupabaseClient } from '@supabase/supabase-js';
import { createServerClient } from '@/utils/supabase';
import { responseError, responseSuccess } from '@/utils/api/responseFactory';
import type { UpsertOptions as UpsertOptionsBase, UserData } from '@/app/types';
import {
	DELETE,
	EQ,
	FROM,
	INSERT,
	SELECT,
	UPDATE,
	UPSERT,
	USER,
	USERS,
} from '@/app/constants';
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

const superiorBaseResponse = {
	data: null,
	error: null,
	success: null,
};

class SuperiorBase {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	private query: any;
	private client: SupabaseClient;
	private errorMsg: string | undefined;
	private messagePieces: SuperiorBaseMessageData;
	private querySteps: string[] = [];
	private successMsg: string | undefined;
	private use_auto_select: boolean;
	private use_upsert_check: boolean;
	private use_user_uid: boolean;
	private user_uid: string;

	constructor({ client, user_uid }: SuperiorBaseArgs) {
		this.client = client;
		this.errorMsg = undefined;
		this.messagePieces = {
			from: '',
			operation: '',
			payloadSize: undefined,
		};
		this.query = undefined;
		this.successMsg = undefined;
		this.use_auto_select = true;
		this.use_upsert_check = true;
		this.use_user_uid = true;
		this.user_uid = user_uid;
	}

	buildMessage({ success = false }: { success: boolean | undefined }): string {
		const { from, operation, payloadSize }: SuperiorBaseMessageData =
			this.messagePieces;

		const message = `Query to ${operation} ${payloadSize ? `${payloadSize} ` : ''}${from} ${success ? 'successful.' : 'failed.'}`;

		return message;
	}

	debug() {
		console.log('\n');
		console.log(this.querySteps);
		console.log(this.messagePieces);
		console.log('\n');
		return this;
	}

	delete() {
		this.fromCheck();

		this.querySteps.push(DELETE);
		this.messagePieces.operation = DELETE;
		this.query = this.query.delete();
		this.query = this.use_auto_select ? this.query.select() : this.query;
		return this;
	}

	eq(field: string, value: string | boolean | number) {
		this.fromCheck();

		this.querySteps.push(EQ);
		this.query = this.query.eq(field, value);
		return this;
	}

	errorMessage(value: string) {
		this.errorMsg = value;
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

	reset() {
		this.errorMsg = undefined;
		this.query = undefined;
		this.querySteps = [];
		this.messagePieces = {
			from: '',
			operation: '',
			payloadSize: undefined,
		};
		this.successMsg = undefined;
		this.use_upsert_check = true;
		this.use_user_uid = true;
	}

	select(value?: string) {
		this.fromCheck();
		this.messagePieces.operation = SELECT;
		this.querySteps.push(SELECT);
		this.query = value ? this.query.select(value) : this.query.select();
		return this;
	}

	single() {
		this.fromCheck();
		this.querySteps.push('single');
		this.query = this.query.single();
		return this;
	}

	successMessage(value: string) {
		this.successMsg = value;
		return this;
	}

	update<T>(data: T) {
		this.fromCheck();

		this.querySteps.push(UPDATE);
		this.messagePieces.operation = UPDATE;
		this.messagePieces.payloadSize = Array.isArray(data) ? data.length : 1;
		this.query = this.query.update(this.whenUpdated(data));
		this.query = this.use_auto_select ? this.query.select() : this.query;
		return this;
	}

	upsert<T>(data: T, options?: UpsertOptions) {
		this.fromCheck();

		this.querySteps.push(UPSERT);
		this.messagePieces.operation = UPSERT;
		this.messagePieces.payloadSize = Array.isArray(data) ? data.length : 1;
		this.query = this.query.upsert(this.whenUpdated(data), options);
		return this;
	}

	upsertCheck<T>(data: T): boolean {
		const { use_upsert_check, messagePieces } = this;

		return (
			data &&
			Array.isArray(data) &&
			use_upsert_check &&
			messagePieces.operation === UPSERT &&
			messagePieces.payloadSize !== data.length
		);
	}

	whenUpdated<T>(data: T): T | T[] | null {
		const updated = getIsoDate();
		if (!Array.isArray(data)) return { ...data, updated };

		return Array.isArray(data) ? data.map((d) => ({ ...d, updated })) : null;
	}

	async go<T>(): Promise<SuperiorBaseResponse<T>> {
		this.fromCheck();

		const { messagePieces } = this;
		const query = this.use_user_uid
			? this.query.eq(
					messagePieces.from !== USERS ? 'user_uid' : 'uid',
					this.user_uid,
				)
			: this.query;
		const { data, error }: QueryResponse<T> = await query; // Execute the supabase query
		const response: SuperiorBaseResponse<T> = {
			...superiorBaseResponse,
		};

		// TODO: NEED TO ACTUALLY ROLLBACK THE UPSERT AND NOT JUST THROW AN ERROR
		const upsertCheck = this.upsertCheck(data);
		if (upsertCheck) console.error('Shit. Upsert size is wrong.');

		if (data) {
			response.data = data;
			response.success = responseSuccess(
				this.successMsg ?? this.buildMessage({ success: true }),
				data,
			);
		} else if (error) {
			response.error = responseError(
				this.errorMsg ?? this.buildMessage({ success: false }),
				error,
			);
		}

		this.reset();
		return response;
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
