import React from 'react';

type InputProps = {
	className?: string;
	fieldName: string;
	type?: 'text' | 'checkbox';
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, fieldName, type = 'text', ...rest }, ref) => {
		return (
			<input
				id={fieldName}
				name={fieldName}
				className={className}
				placeholder="Type here..."
				type={type}
				ref={ref} // Attach ref here
				{...rest} // Spread the rest of the input attributes
			/>
		);
	},
);
Input.displayName = 'Input';

export default Input;
