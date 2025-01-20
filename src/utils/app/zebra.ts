import type { TransactionData } from '@/app/types';

export default function zebra(index: number, transaction?: TransactionData) {
	const zebraColor = index % 2 ? 'bg-slate-100' : 'bg-white';
	return transaction?.prime ? 'bg-accent' : zebraColor;
}
