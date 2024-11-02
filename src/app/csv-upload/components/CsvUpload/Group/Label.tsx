import type React from 'react';

type LabelProps = {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	children: any;
	className?: string;
	htmlFor: string;
} & React.LabelHTMLAttributes<HTMLLabelElement>;

export default function Label({
	children,
	className = '',
	htmlFor,
	...rest
}: LabelProps) {
	const classes = [
		'input input-bordered input-sm flex items-center gap-2 mb-2 font-bold',
		className,
	].join(' ');

	return (
		<label className={classes} htmlFor={htmlFor} {...rest}>
			{children}
		</label>
	);
}
