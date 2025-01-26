import type React from 'react';
import Image from 'next/image';
import type {
	GroupData,
	TransactionData,
	TransactionWithGroupData,
} from '@/app/types';
import { apiCall, formatAmount, formatRecurring, zebra } from '@/utils/app';
import { tableClasses, tdClasses, tdOverflow, thClasses } from './helpers';
import classNames from 'classnames';
import TransactionName from './TransactionName';
import Button from '../Button';
import { useFormMessagingContext } from '../FormMessaging';
import { Fragment, useState } from 'react';
import GroupUpdate from './GroupUpdate';

type ViewStandardProps = {
	activeElement: number | boolean | { parent: number; child: number };
	disabled?: boolean;
	setActiveElement: (arg: number | boolean) => void;
	showHeader?: boolean;
	tableClassName: string;
	transactions: TransactionWithGroupData[];
};

// COMPONENT
export default function ViewStandard({
	activeElement,
	disabled,
	setActiveElement,
	showHeader = true,
	tableClassName = '',
	transactions,
}: ViewStandardProps): React.ReactNode {
	// STATE
	const [groupToEdit, setGroupToEdit] = useState<GroupData | null>(null);
	const [groupTransactions, setGroupTransactions] = useState<
		TransactionData[] | null
	>(null);

	// CONTEXT
	const { setError, setSuccess } = useFormMessagingContext();

	// HANDLERS
	const handleGetData = async (
		group_uid: string | undefined,
		index: number,
	): Promise<void> => {
		setActiveElement(index);

		// GET THE GROUP AND THE TRANSACTIONS FOR THAT GROUP
		const results = await Promise.all([
			apiCall('api/group/select', {
				payload: { uid: group_uid },
			}),
			apiCall('api/transactions/select/by-group', {
				payload: { group_uid },
			}),
		]);

		// If there's errors in either response, return nothing
		if (!results.every((e) => !e.error)) {
			console.error({ results });
			setError('There was an error retrieving the group');
			return;
		}

		// Break the results up
		const [group, transactions] = results.map((m) => m.data);

		setSuccess('Successfully retrieved Group data');
		setGroupToEdit(group);
		setGroupTransactions(transactions);
	};

	return (
		<table className={tableClasses(tableClassName)}>
			{showHeader && (
				<thead>
					<tr className="bg-neutral">
						<th className={thClasses(3)}>Name</th>
						<th className={thClasses(4)}>Description</th>
						<th className={thClasses(1)}>Amount</th>
						<th className={thClasses(1)}>Category</th>
						<th className={thClasses(1)}>Recurring</th>
						<th className={thClasses(1)}>Autopay</th>
						<th className={thClasses(1)} />
					</tr>
				</thead>
			)}

			<tbody>
				{transactions.map((transaction, index) => {
					const activeObject =
						typeof activeElement === 'object' ? activeElement : false;
					const showEditGroup =
						activeObject && activeObject.child === index && !disabled;

					return (
						<Fragment key={transaction.uid}>
							<tr className={zebra(index, transaction)}>
								<td className={tdClasses(3)}>
									<div className="flex">
										<TransactionName transaction={transaction} />

										{transaction.prime && (
											<span className="tooltip cursor-help" data-tip="Prime">
												<Image
													alt="A King's Crown"
													className="my-0 ml-2"
													height="16"
													src="/images/prime.svg"
													width="16"
												/>
											</span>
										)}
									</div>
								</td>
								<td className={classNames([tdOverflow(), tdClasses(6)])}>
									{transaction.description}
								</td>
								<td className={tdClasses(1)}>
									{formatAmount(transaction.amount)}
								</td>
								<td className={tdClasses(1)}>{transaction.category}</td>
								<td className={tdClasses(1)}>{formatRecurring(transaction)}</td>
								<td className={tdClasses(1)}>
									{transaction.group_recurring_autopay && 'Yes'}
								</td>
								<td className={tdClasses(1)}>
									{transaction.group_uid && (
										<Button
											className="btn-primary btn-xs text-black"
											disabled={!!activeObject}
											onClick={() =>
												handleGetData(transaction.group_uid, index)
											}
										>
											Edit Group
										</Button>
									)}
								</td>
							</tr>

							{showEditGroup && (
								<tr>
									<td colSpan={7}>
										<GroupUpdate
											group={groupToEdit}
											setActiveElement={() => setActiveElement(false)}
											transactions={groupTransactions}
										/>
									</td>
								</tr>
							)}
						</Fragment>
					);
				})}
			</tbody>
		</table>
	);
}
