import React from 'react';

type Sizes = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

type InputProps = {
	className?: string;
	sizeSuffix?: Sizes;
	type: 'text' | 'checkbox';
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className = '', sizeSuffix = 'md', type = 'text', ...rest }, ref) => {
		const typeClasses = {
			checkbox: `checkbox checkbox-${sizeSuffix}`,
			text: `grow font-normal text-${sizeSuffix}`,
		};
		const classes = [typeClasses[type], className].join(' ');

		return (
			<input
				className={classes}
				placeholder="Type here..."
				ref={ref}
				type={type}
				{...rest}
			/>
		);
	},
);
Input.displayName = 'Input';

export default Input;
