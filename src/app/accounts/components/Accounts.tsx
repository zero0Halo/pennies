'use client';

import type { AccountDBData } from '@/app/types';
import AccountCreate from './AccountCreate';
import AccountsTable from './AccountsTable';
import { useState } from 'react';

interface AccountsProps {
	accountsData: AccountDBData[];
}

export default function Accounts({ accountsData }: AccountsProps) {
	const [creatingAccount, setCreatingAccount] = useState(false);

	return (
		<div>
			{(accountsData.length === 0 || creatingAccount) && (
				<div className="prose">
					<h2>Create an Account</h2>
					<AccountCreate
						accountsData={accountsData}
						setCreatingAccount={setCreatingAccount}
					/>
				</div>
			)}

			{accountsData.length > 0 && (
				<>
					<button
						className="btn btn-primary btn-sm"
						disabled={creatingAccount}
						onClick={() => setCreatingAccount(true)}
						type="button"
					>
						Create an Account
					</button>
					<AccountsTable
						accountsData={accountsData}
						creatingAccount={creatingAccount}
					/>
				</>
			)}
		</div>
	);
}
