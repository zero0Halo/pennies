import Button from '@/app/components/Button';
import type { TransactionData } from '@/app/types';
import { dateFormat, displayAmount, zebra } from '@/utils/app';

interface TransactionRowProps {
	activeElement: undefined | number;
	creating: boolean;
	index: number;
	setActiveElement: (arg: number) => void;
	transaction: TransactionData;
}

export default function TransactionRow({
	activeElement,
	creating,
	index,
	setActiveElement,
	transaction,
}: TransactionRowProps) {
	if (creating) return null;

	return (
		<tr className={zebra(index, transaction)} key={transaction.uid}>
			<th>{index + 1}</th>
			<td>{transaction.description}</td>
			<td>{displayAmount(transaction.amount)}</td>
			<td className="flex">
				<div className="self-center">{dateFormat(transaction.timestamp)}</div>
				{!transaction.group_uid && (
					<div className="ml-auto">
						<Button
							className="btn-success"
							disabled={typeof activeElement === 'number'}
							onClick={() => setActiveElement(index)}
						>
							Create
						</Button>
					</div>
				)}
			</td>
		</tr>
	);
}
