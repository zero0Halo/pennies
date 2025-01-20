'use client';

import type React from 'react';
import classNames from 'classnames';
import type {
	FindGroupsData,
	TransactionData,
	TransactionWithGroupData,
} from '@/app/types';
import ViewSingleton from './ViewSingleton';
import ViewSingletonComplete from './ViewSingletonComplete';
import ViewStandard from './ViewStandard';
import { useEffect, useState } from 'react';
import ViewGrouped from './ViewGrouped';

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
	activeElement?: number | boolean;
	className?: string;
	setActiveElement?: (arg: number | boolean) => void;
	setCSVData?: React.Dispatch<React.SetStateAction<FindGroupsData | undefined>>;
	showHeader?: boolean;
	tableClassName?: string;
	title?: string;
	transactions: TransactionData[] | TransactionWithGroupData[];
	view?: Views;
}

// COMPONENT
export default function Transactions({
	activeElement,
	className,
	setActiveElement,
	setCSVData,
	showHeader,
	tableClassName = '',
	title,
	transactions,
	view = STANDARD,
}: TransactionsProps): React.ReactNode {
	if (!transactions.length) return null;

	// STATE
	const [internalActiveElement, setInternalActiveElement] = useState<
		number | boolean
	>(activeElement ?? false);

	// EFFECTS
	useEffect(() => {
		if (activeElement !== undefined) {
			setInternalActiveElement(activeElement);
		}
	}, [activeElement]);

	// SHUGAH
	const componentClasses = classNames(
		'overflow-auto max-h-[500px] relative z-0',
		className,
	);
	const props = {
		activeElement: internalActiveElement,
		setActiveElement: setActiveElement ?? setInternalActiveElement,
		showHeader,
		tableClassName,
	};

	// JSX
	return (
		<div className={componentClasses}>
			{title && <h3>{title}</h3>}

			{(() => {
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
							<ViewSingleton
								setCSVData={setCSVData}
								transactions={transactions as TransactionData[]}
								{...props}
							/>
						);
					case SINGLETON_COMPLETE:
						return (
							<ViewSingletonComplete
								transactions={transactions as TransactionWithGroupData[]}
								{...props}
							/>
						);
					case STANDARD:
						return (
							<ViewStandard
								transactions={transactions as TransactionWithGroupData[]}
								{...props}
							/>
						);
					default:
						null;
				}
			})()}
		</div>
	);
}
