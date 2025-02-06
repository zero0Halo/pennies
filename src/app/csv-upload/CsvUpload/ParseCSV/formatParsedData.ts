import { createTransactionData, type TransactionData } from '@/app/types';
import blacklist from './blacklist';
import regex from './regex';
import type { FormatParsedDataArgs } from './types';
import { getIsoDate } from '@/utils/general';
import { v4 } from 'uuid';
import { stringToHash } from '@/utils/app';

export default function formatParsedData({
	accountUid,
	parsedData,
	user_uid,
}: FormatParsedDataArgs): TransactionData[] {
	return parsedData.map((d: string[]) => {
		const filteredRow = d.filter((f) => f && f.length > 1);
		const amount = +(filteredRow?.at(1) ?? 0);
		const date = filteredRow?.at(0) ?? '';
		const description = filteredRow?.at(2)?.toLowerCase() ?? '';
		const terms = description
			.replace(regex.creditCard, '')
			.replace(regex.date, '')
			.replace(regex.numericIds, '')
			.replace(regex.mixedIds, '')
			.split(' ')
			.filter((term) => !blacklist.includes(term) && term.length > 0);
		const timestamp = getIsoDate(date);
		const uid = v4();

		const transactionData: TransactionData = createTransactionData({
			account_uid: accountUid,
			amount,
			category: '',
			description,
			hash: stringToHash(`${accountUid}${amount}${description}${timestamp}`),
			prime: false,
			terms,
			timestamp,
			to_account_uid: undefined,
			transfer_uid: undefined,
			uid,
			user_uid,
		});

		return transactionData;
	});
}
