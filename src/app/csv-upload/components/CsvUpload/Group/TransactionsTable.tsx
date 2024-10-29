import type { GroupData } from '@/app/types';

interface TransactionsTableProps {
	groupData: GroupData;
}

const displayAmount = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
});

export function TransactionsTable({ groupData }: TransactionsTableProps) {
	return (
		<div className="overflow-x-auto">
			<table className="table table-zebra">
				<thead>
					<tr className="bg-neutral">
						<th />
						<th className="text-white text-base">Description</th>
						<th className="text-white text-base">Amount</th>
						<th className="text-white text-base">Date</th>
					</tr>
				</thead>

				<tbody>
					<tr className="bg-primary">
						<th>1</th>
						<td>{groupData.prime.description}</td>
						<td>{displayAmount.format(groupData.prime.amount)}</td>
						<td>{groupData.prime.date}</td>
					</tr>

					{groupData.transactions.length >= 1 &&
						groupData.transactions.map((transaction, i) => (
							<tr key={transaction.uid}>
								<th>{i + 2}</th>
								<td>{transaction.description}</td>
								<td>{displayAmount.format(transaction.amount)}</td>
								<td>{transaction.date}</td>
							</tr>
						))}
				</tbody>
			</table>
		</div>
	);
}
