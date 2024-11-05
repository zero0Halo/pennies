import type { FindGroupsData } from '@/app/types';

interface StatsProps {
	groupsData: FindGroupsData;
}

export default function Stats({ groupsData }: StatsProps) {
	const numRecurringGroups = groupsData.groups.filter(
		({ group }) => group.recurring,
	).length;
	const numGroupTransactions = groupsData.groups.reduce(
		(acc, current) => acc + current.transactions.length,
		0,
	);
	const totalWarning =
		numGroupTransactions + groupsData.singletons.length !== groupsData.total;

	const statsArray = [
		{ label: '# of Transactions', value: groupsData.total },
		{
			label: '# of Groups',
			value: groupsData.groups.length,
			description: `${numRecurringGroups} Recurring`,
		},
		{ label: '# of Transactions in Groups', value: numGroupTransactions },
		{
			label: '# of Ungrouped Transactions',
			value: groupsData.singletons.length,
		},
	];

	return (
		<div className="stats w-full">
			{statsArray.map((stat) => (
				<div className="stat" key={stat.label}>
					<span className="stat-title">{stat.label}</span>
					<span className="stat-value">{stat.value}</span>
					<span className="stat-desc h-4">{stat.description ?? ' '}</span>
				</div>
			))}

			{totalWarning && (
				<div className="alert alert-warning font-bold">
					<div className="pb-2">
						The total number of entries from the CSV file do not match the
						number of processed entries.
					</div>

					<div>From CSV: {groupsData.total}</div>

					<div>
						Processed: {numGroupTransactions + groupsData.singletons.length}
					</div>
				</div>
			)}
		</div>
	);
}
