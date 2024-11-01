import type React from 'react';

type ButtonProps = {
	children: React.ReactNode;
	className?: string;
	type?: 'button' | 'reset' | 'submit';
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
	children,
	className = '',
	type = 'button',
	...rest
}: ButtonProps) {
	let classes: string | string[] = ['btn btn-sm font-bold shadow', className];
	className?.includes('btn-warning')
		? classes.push('text-black')
		: classes.push('text-white');
	classes = classes.join(' ');

	return (
		<button className={classes} type={type} {...rest}>
			{children}
		</button>
	);
}
