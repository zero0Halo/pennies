import { CHECKING, CREDIT_CARD, INVESTMENT, SAVINGS } from '@/app/constants';
import type { AccountData } from '@/app/types';
import type { FieldError, UseFormRegister } from 'react-hook-form';

interface SelectTypeProps {
	className?: string;
	error: FieldError | undefined;
	register: UseFormRegister<AccountData>;
}

export default function SelectType({
	className,
	error,
	register,
}: SelectTypeProps) {
	let classes: string[] | string = ['select select-sm select-bordered'];
	if (error) classes.push('select-error');
	if (className) classes.push(className);
	classes = classes.join(' ');

	return (
		<select className={classes} {...register('type', { required: true })}>
			<option />
			<option value={CHECKING}>Checking</option>
			<option value={CREDIT_CARD}>Credit Card</option>
			<option value={INVESTMENT}>Investment</option>
			<option value={SAVINGS}>Savings</option>
		</select>
	);
}
