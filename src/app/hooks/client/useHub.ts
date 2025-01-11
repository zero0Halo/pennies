import type {
	TransactionWithDateData,
	TransactionWithGroupData,
} from '@/app/types';
import { useEffect, useState } from 'react';

interface UseHubProps {
	transactionsData: TransactionWithDateData[] | undefined;
}

type UseHubData = {
	sumForDate: number | undefined;
	todayDate: number;
	transactions: TransactionWithGroupData[] | undefined;
	recurring: TransactionWithGroupData[] | undefined;
};

export default function useHub({ transactionsData }: UseHubProps): UseHubData {
	const todayDate = 3; //+new Date().getDate();

	// STATE
	const [transactionsForDate, setTransactionsForDate] = useState<
		TransactionWithDateData[] | undefined
	>();
	const [sumForDate, setSumForDate] = useState(0);
	const [transactions, setTransactions] = useState<
		TransactionWithGroupData[] | undefined
	>();
	const [recurring, setRecurring] = useState<
		TransactionWithGroupData[] | undefined
	>();

	useEffect(() => {
		if (transactionsData) {
			const [_, _transactionsForDate] =
				transactionsData.find(([{ date }]) => date === todayDate) || [];
			const _sumForDate =
				_transactionsForDate?.reduce((acc, { amount }) => acc + amount, 0) ?? 0;
			const _transactions = _transactionsForDate?.filter(
				({ group_recurring }) => !group_recurring,
			);
			const _recurring = _transactionsForDate?.filter(
				({ group_recurring }) => group_recurring,
			);

			setTransactionsForDate(transactionsData);
			setSumForDate(_sumForDate);
			setTransactions(_transactions);
			setRecurring(_recurring);
		}
	}, [transactionsData]);

	return { sumForDate, todayDate, transactions, recurring };

	// MEMO
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	// const transactionsByDate = useMemo<TransactionWithGroupData[]>(() => {
	//   if (transactionsData){
	//     const todayTransactionData = transactionsData.find(([{ date }]) => date === todayDate);
	//     const todaySum = todayTransactionData?.reduce((acc, {amount}) => acc + amount,0)
	//     return !todayTransactionData ? [] : todayTransactionData[1];
	//   }
	//   return [];
	// }, [todayDate, transactionsData]);
	// const {transactions, transactionsRecurring} = useMemo(() => {
	//   if (transactionsByDate.length)
	//     return { transactions: transactionsByDate.filter(({group_recurring}) => !group_recurring), transactionsRecurring: transactionsByDate.filter(({group_recurring}) => group_recurring) };
	//   return { transactions: [], transactionsRecurring: [] }
	// }, []);

	// const transactionsByRecurring = useMemo(() => {
	// 	if (transactionsByDate.length)
	// 		return transactionsByDate
	// 			.filter(
	// 				(t) => t.filter(({ group_recurring }) => group_recurring).length,
	// 			)
	// 			.map((t) => t.filter(({ group_recurring }) => group_recurring),
	// 			);
	// 	return [];
	// }, [transactionsByDate]);

	// console.log({transactions, transactionsRecurring})
}
