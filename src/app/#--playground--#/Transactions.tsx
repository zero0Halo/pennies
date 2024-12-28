import type React from 'react';
import classNames from 'classnames';
import { produce } from 'immer';
import type { TransactionData } from '@/app/types';
import type { CREATE, DELETE, UPDATE } from '@/app/constants';
import { useMemo } from 'react';
const GROUPED = 'grouped';
const SINGLETON = 'singleton';
const STANDARD = 'standard';

type CRUD = (typeof CREATE | typeof DELETE | typeof UPDATE)[];
type Views = typeof GROUPED | typeof SINGLETON | typeof STANDARD;

interface TransactionsProps {
	className?: string;
	showHeader?: boolean;
	tableClassName?: string;
	title?: string;
	transactions: TransactionData[];
	type?: CRUD;
	view?: Views;
}

type CellConfig = {
	i: number;
	on: boolean;
	label: string | null;
	w: string;
};

type CellArrayConfig = CellConfig & {
	field: string;
};

type ConfigData = {
	[key: string]: CellConfig;
};

const columnConfig: ConfigData = {
	count: { i: 0, on: true, label: null, w: 'w-1/12' },
	name: { i: 1, on: true, label: 'Name', w: 'w-2/12' },
	description: { i: 2, on: true, label: 'Description', w: 'w-4/12' },
	amount: { i: 3, on: true, label: 'Amount', w: 'w-1/12' },
	timestamp: { i: 4, on: true, label: 'Date', w: 'w-2/12' },
	recurring: { i: 5, on: true, label: 'Recurring', w: 'w-1/12' },
	category: { i: 6, on: true, label: 'Category', w: 'w-1/12' },
};
const config = {
	[GROUPED]: { ...columnConfig },
	[SINGLETON]: produce(columnConfig, (draft) => {
		draft.name.on = false;
		draft.description.w = 'w-7/12';
		draft.amount.w = 'w-2/12';
		draft.recurring.on = false;
		draft.category.on = false;
	}),
	[STANDARD]: produce(columnConfig, (draft) => {
		draft.count.on = false;
		draft.name.w = 'w-5/12';
		draft.description.on = false;
	}),
};

export default function Transactions({
	className,
	showHeader = true,
	tableClassName,
	title,
	transactions,
	type,
	view = STANDARD,
}: TransactionsProps): React.ReactNode {
	// if (!transactions.length) return null;

	// Convert the config to an array for easier iteration
	const viewConfig: CellArrayConfig[] = useMemo(
		() =>
			Object.entries(config[view])
				.map(([key, data]) => ({
					...data,
					field: key,
				}))
				.sort((a, b) => a.i - b.i),
		[view],
	);

	// SHUGAH
	const componentClassNames = classNames('overflow-hidden', className);
	const tableClassNames = classNames(
		'table overflow-hidden rounded-lg  mt-0',
		tableClassName,
	);

	return (
		<div className={componentClassNames}>
			{title && <h3>{title}</h3>}

			<table className={tableClassNames}>
				{showHeader && (
					<thead>
						<tr className="bg-neutral">
							{viewConfig.map(
								(cell) =>
									cell.on && (
										<th
											key={cell.field}
											className={classNames(
												'text-white text-base py-1',
												cell.w,
											)}
										>
											{cell.label}
										</th>
									),
							)}
							{/* <th />
							<th className="text-white text-base py-1">Name</th>
							<th className="text-white text-base py-1">Description</th>
							<th className="text-white text-base py-1">Amount</th>
							<th className="text-white text-base py-1">Date</th>
							<th className="text-white text-base py-1">Recurring</th>
							<th className="text-white text-base py-1">Category</th> */}
						</tr>
					</thead>
				)}
			</table>
		</div>
	);
}
