import React from 'react';

type InputProps = {
	className?: string;
	fieldName: string;
	label: string;
	type?: 'text' | 'checkbox';
} & React.InputHTMLAttributes<HTMLInputElement>; // Extend with native input props

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ label, className = '', fieldName, type = 'text', ...rest }, ref) => {
		const classes = [
			'input input-bordered input-sm flex items-center gap-2 mb-2 font-bold',
			className,
		].join(' ');
		const typeClasses = {
			checkbox: 'checkbox checkbox-sm',
			text: 'grow font-normal',
		};

		return (
			<label className={classes} htmlFor={fieldName}>
				{label}:
				<input
					id={fieldName}
					name={fieldName}
					className={typeClasses[type]}
					placeholder="Type here..."
					type={type}
					ref={ref} // Attach ref here
					{...rest} // Spread the rest of the input attributes
				/>
			</label>
		);
	},
);

// Add a display name for better debugging (optional but recommended)
Input.displayName = 'Input';

export default Input;
