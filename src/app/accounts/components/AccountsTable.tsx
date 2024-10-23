'use client';

import type { AccountDBData } from '../../types';

interface AccountsTableProps {
	accountsData: AccountDBData[];
}

export default function AccountsTable({ accountsData }: AccountsTableProps) {
	return (
		<div className="overflow-x-auto">
			<table className="table table-zebra border-2">
				<thead>
					<tr className="bg-neutral">
						<th />
						<th className="text-white text-base">Name</th>
						<th className="text-white text-base">Type</th>
						<th className="text-white text-base">Default</th>
					</tr>
				</thead>

				<tbody>
					{accountsData.length > 0 &&
						accountsData.map((account, i) => (
							<tr
								className={account.is_default ? '!bg-primary' : ''}
								key={account.uid}
							>
								<th>{i + 1}</th>
								<td>{account.name}</td>
								<td>{account.type}</td>
								<td>{account.is_default && 'Yes'}</td>
							</tr>
						))}
				</tbody>
			</table>
		</div>
	);
}
