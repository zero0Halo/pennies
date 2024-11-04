import React from 'react';

type InputProps = {
	className?: string;
	type: 'text' | 'checkbox';
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className = '', type = 'text', ...rest }, ref) => {
		const typeClasses = {
			checkbox: 'checkbox checkbox-sm',
			text: 'grow font-normal',
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
