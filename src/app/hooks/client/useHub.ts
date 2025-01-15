import type {
	TransactionWithDateData,
	TransactionWithGroupData,
} from '@/app/types';
import { useEffect, useState } from 'react';

interface UseHubProps {
	transactionsData: TransactionWithDateData[] | null;
}

type UseHubData = {
	noAutopay: TransactionWithGroupData[] | null;
	recurring: TransactionWithGroupData[] | null;
	sumForDate: number | null;
	todayDate: number;
	transactions: TransactionWithGroupData[] | null;
	transactionsForDate: TransactionWithDateData[] | null;
};

export default function useHub({ transactionsData }: UseHubProps): UseHubData {
	const todayDate = +new Date().getDate();

	// STATE
	const [transactionsForDate, setTransactionsForDate] = useState<
		TransactionWithDateData[] | null
	>();
	const [sumForDate, setSumForDate] = useState(0);
	const [transactions, setTransactions] = useState<
		TransactionWithGroupData[] | null
	>();
	const [recurring, setRecurring] = useState<
		TransactionWithGroupData[] | null
	>();
	const [noAutopay, setNoAutopay] = useState<
		TransactionWithGroupData[] | null
	>();

	useEffect(() => {
		if (Array.isArray(transactionsData)) {
			const [_, _transactionsForDate] = transactionsData.find(
				([{ date }]) => date === todayDate,
			) || [null, null];
			const _sumForDate =
				_transactionsForDate?.reduce((acc, { amount }) => acc + amount, 0) ?? 0;
			const _transactions =
				_transactionsForDate?.filter(
					({ group_recurring }) => !group_recurring,
				) ?? null;
			const _recurring =
				_transactionsForDate?.filter(
					({ group_recurring, group_recurring_autopay }) =>
						group_recurring && group_recurring_autopay,
				) ?? null;
			const _noAutopay =
				_transactionsForDate?.filter(
					({ group_recurring, group_recurring_autopay }) =>
						group_recurring && !group_recurring_autopay,
				) ?? null;

			setNoAutopay(_noAutopay);
			setRecurring(_recurring);
			setSumForDate(_sumForDate);
			setTransactions(_transactions);
			setTransactionsForDate(transactionsData);
		}
	}, [todayDate, transactionsData]);

	return {
		noAutopay: Array.isArray(noAutopay) ? noAutopay : null,
		recurring: Array.isArray(recurring) ? recurring : null,
		sumForDate,
		todayDate,
		transactions: Array.isArray(transactions) ? transactions : null,
		transactionsForDate: Array.isArray(transactionsForDate)
			? transactionsForDate
			: null,
	};
}
