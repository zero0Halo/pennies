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
	let classes: string | string[] = ['btn font-bold shadow', className];
	const textColors = ['text-white', 'text-black'];
	const sizes = ['btn-xs', 'btn-sm', 'btn-md', 'btn-lg'];
	const hasSize = className.split(' ').some((word) => sizes.includes(word));
	const hasTextColor = className
		.split(' ')
		.some((word) => textColors.includes(word));

	if (className?.includes('btn-warning') && !hasTextColor)
		classes.push('text-black');
	else if (!hasTextColor) classes.push('text-white');

	if (!hasSize) classes.push('btn-sm');

	classes = classes.join(' ');

	return (
		<button className={classes} type={type} {...rest}>
			{children}
		</button>
	);
}
