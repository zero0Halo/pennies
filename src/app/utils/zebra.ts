import type { FormattedRowData } from '@/app/types';

export default function zebra(index: number, transaction?: FormattedRowData) {
	const zebraColor = index % 2 ? 'bg-slate-100' : 'bg-white';
	return transaction?.prime ? 'bg-primary' : zebraColor;
}
