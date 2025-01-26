import type React from 'react';

type Sizes = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

type LabelProps = {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	children: any;
	className?: string;
	htmlFor: string;
	sizeSuffix?: Sizes;
} & React.LabelHTMLAttributes<HTMLLabelElement>;

export default function Label({
	children,
	className = '',
	htmlFor,
	sizeSuffix = 'sm',
	...rest
}: LabelProps) {
	const classes = [
		`input input-bordered input-${sizeSuffix} text-${sizeSuffix} flex items-center gap-2 mb-2 font-bold overflow-hidden`,
		className,
	].join(' ');

	return (
		<label className={classes} htmlFor={htmlFor} {...rest}>
			{children}
		</label>
	);
}
