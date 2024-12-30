'use client';

import type React from 'react';
import classNames from 'classnames';
import type { TransactionData, TransactionWithGroupData } from '@/app/types';
import type { CREATE, DELETE, UPDATE } from '@/app/constants';
import ViewStandard from './ViewStandard';
import { useEffect, useState } from 'react';

const GROUPED = 'grouped';
const SINGLETON = 'singleton';
const STANDARD = 'standard';

type Views = typeof GROUPED | typeof SINGLETON | typeof STANDARD;

interface TransactionsProps {
	activeElement?: number | boolean;
	className?: string;
	setActiveElement?: (arg: number | boolean) => void;
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
	const componentClasses = classNames('overflow-hidden', className);

	// JSX
	return (
		<div className={componentClasses}>
			{title && <h3>{title}</h3>}

			{(() => {
				switch (view) {
					case STANDARD:
						return (
							<ViewStandard
								activeElement={internalActiveElement}
								setActiveElement={setActiveElement ?? setInternalActiveElement}
								tableClassName={tableClassName}
								transactions={transactions as TransactionWithGroupData[]}
							/>
						);
					default:
						null;
				}
			})()}
		</div>
	);
}
