'use client';

import { useState } from 'react';
import type { AccountDBData } from '../../types';
import AccountRow from './AccountRow';

interface AccountsTableProps {
	accountsData: AccountDBData[];
}

export default function AccountsTable({ accountsData }: AccountsTableProps) {
	const [editingRow, setEditingRow] = useState<number | undefined>();

	return (
		<div className="overflow-x-auto">
			<table className="table table-zebra border-2">
				<thead>
					<tr className="bg-neutral">
						<th className="w-1/12" />
						<th className="text-white text-base w-6/12">Name</th>
						<th className="text-white text-base w-2/12">Type</th>
						<th className="text-white text-base w-1/12 text-center">Default</th>
						<th className="w-2/12" />
					</tr>
				</thead>

				<tbody>
					{accountsData.length > 0 &&
						accountsData.map((account, i) => (
							<AccountRow
								account={account}
								editingRow={editingRow === i}
								index={i}
								setEditingRow={setEditingRow}
								key={account.uid}
							/>
						))}
				</tbody>
			</table>
		</div>
	);
}
