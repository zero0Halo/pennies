'use client';

import type React from 'react';
import classNames from 'classnames';
import type {
	FindGroupsData,
	TransactionData,
	TransactionWithGroupData,
} from '@/app/types';
import TransactionsSingleton from './views/TransactionsSingleton';
import TransactionsSingletonComplete from './views/TransactionsSingletonComplete';
import TransactionsStandard from './views/TransactionsStandard';
import { useEffect, useState } from 'react';
import ViewGrouped from './views/TransactionsGrouped';
import type { ParseCSVData } from '@/app/types/ParseCSV';

const GROUPED = 'grouped';
const SINGLETON = 'singleton';
const SINGLETON_COMPLETE = 'singletonComplete';
const STANDARD = 'standard';

type Views =
	| typeof GROUPED
	| typeof SINGLETON
	| typeof SINGLETON_COMPLETE
	| typeof STANDARD;

interface TransactionsProps {
	activeElement?: number | boolean | { parent: number; child: number };
	className?: string;
	disabled?: boolean;
	setActiveElement?: (arg: number | boolean) => void;
	setCSVData?: React.Dispatch<React.SetStateAction<ParseCSVData | undefined>>;
	showHeader?: boolean;
	showNone?: boolean;
	tableClassName?: string;
	title?: string;
	transactions: TransactionData[] | TransactionWithGroupData[];
	view?: Views;
}

// COMPONENT
export default function Transactions({
	activeElement,
	className,
	disabled,
	setActiveElement,
	setCSVData,
	showHeader,
	showNone,
	tableClassName = '',
	title,
	transactions,
	view = STANDARD,
}: TransactionsProps): React.ReactNode {
	if (!showNone && !transactions.length) return null;

	// STATE
	const [internalActiveElement, setInternalActiveElement] = useState<
		number | boolean | { parent: number; child: number }
	>(activeElement ?? false);

	// EFFECTS
	useEffect(() => {
		if (activeElement !== undefined) {
			setInternalActiveElement(activeElement);
		}
	}, [activeElement]);

	// SHUGAH
	const componentClasses = classNames(
		'overflow-y-auto max-h-[500px] relative z-0',
		className,
	);
	const props = {
		disabled,
		activeElement: internalActiveElement,
		setActiveElement: setActiveElement ?? setInternalActiveElement,
		showHeader,
		tableClassName,
	};

	// JSX
	return (
		<div className={componentClasses}>
			{title && <h3 className="mt-3">{title}</h3>}

			{transactions.length > 0 &&
				(() => {
					switch (view) {
						case GROUPED:
							return (
								<ViewGrouped
									transactions={transactions as TransactionData[]}
									{...props}
								/>
							);
						case SINGLETON:
							return (
								<TransactionsSingleton
									setCSVData={setCSVData}
									transactions={transactions as TransactionData[]}
									{...props}
								/>
							);
						case SINGLETON_COMPLETE:
							return (
								<TransactionsSingletonComplete
									transactions={transactions as TransactionWithGroupData[]}
									{...props}
								/>
							);
						case STANDARD:
							return (
								<TransactionsStandard
									transactions={transactions as TransactionWithGroupData[]}
									{...props}
								/>
							);
						default:
							null;
					}
				})()}

			{showNone && transactions.length === 0 && <h5>None</h5>}
		</div>
	);
}
