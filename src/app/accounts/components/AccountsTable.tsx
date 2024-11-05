'use client';

import { useState } from 'react';
import type { AccountDBData, ActiveRowData } from '../../types';
import AccountRow from './AccountRow';
import { DELETE, EDIT } from '@/app/constants';
import useLoading from '@/app/hooks/useLoading';

interface AccountsTableProps {
	accountsData: AccountDBData[];
	creatingAccount: boolean;
}

export default function AccountsTable({
	accountsData,
	creatingAccount,
}: AccountsTableProps) {
	const [activeRow, setActiveRow] = useState<ActiveRowData>({
		mode: false,
		index: false,
	});
	const { Loading } = useLoading();

	return (
		<div className={'overflow-x-auto relative'}>
			{creatingAccount && <Loading hideSpinner />}
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
								index={i}
								isEditing={activeRow.mode === EDIT && activeRow.index === i}
								isDeleting={activeRow.mode === DELETE && activeRow.index === i}
								setActiveRow={setActiveRow}
								key={account.uid}
							/>
						))}
				</tbody>
			</table>
		</div>
	);
}
