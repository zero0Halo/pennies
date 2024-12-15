import Button from '@/app/components/Button';
import type { TransactionData } from '@/app/types';

interface TransactionCreateProps {
	creating: boolean;
	setActiveElement: (arg: undefined) => void;
	transaction: TransactionData;
}

export default function TransactionCreate({
	creating,
	setActiveElement,
	transaction,
}: TransactionCreateProps) {
	if (!creating) return null;

	return (
		<tr>
			<td colSpan={4}>
				<div className={'bg-primary pt-1 p-8 rounded-lg relative'}>
					<h3>Create Transaction</h3>
					<h4>{transaction.description}</h4>

					<div className="join join-horizontal w-full">
						<Button
							className="join-item btn-warning mr-1 w-1/2"
							onClick={() => setActiveElement(undefined)}
						>
							Cancel
						</Button>
						<Button className="join-item btn-success w-1/2">
							Create Transaction
						</Button>
					</div>
				</div>
			</td>
		</tr>
	);
}
