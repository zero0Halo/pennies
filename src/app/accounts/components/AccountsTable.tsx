'use client';

import { useState } from 'react';
import type { AccountDBData } from '../../types';
import AccountRow from './AccountRow';

interface AccountsTableProps {
	accountsData: AccountDBData[];
	creatingAccount: boolean;
}

export default function AccountsTable({
	accountsData,
	creatingAccount,
}: AccountsTableProps) {
	const [editingRow, setEditingRow] = useState<number | false>(false);

	const disabled =
		" after:content[''] after:absolute after:w-full after:h-full after:z-50 after:bg-white after:opacity-60 after:top-0 after:left-0";

	return (
		<div
			className={`overflow-x-auto relative${creatingAccount ? disabled : ''}`}
		>
			<table className="table border-2">
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
