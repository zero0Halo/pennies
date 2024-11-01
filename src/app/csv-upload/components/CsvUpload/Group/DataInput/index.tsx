import React from 'react';
import Input from './Input';
import Select from './Select';

type DataInputProps = {
	className?: string;
	fieldName: string;
	label: string;
	options?: string[];
	type?: 'text' | 'checkbox' | 'select';
};

const DataInput = React.forwardRef<
	HTMLInputElement | HTMLSelectElement,
	DataInputProps
>(
	(
		{ label, className = '', fieldName, options, type = 'text', ...rest },
		ref,
	) => {
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
				{type !== 'select' && (
					<Input
						fieldName={fieldName}
						className={typeClasses[type]}
						type={type}
						ref={ref as React.Ref<HTMLInputElement>}
						{...rest}
					/>
				)}
				{type === 'select' && Array.isArray(options) && (
					<Select
						fieldName={fieldName}
						options={options}
						ref={ref as React.Ref<HTMLSelectElement>}
						{...rest}
					/>
				)}
			</label>
		);
	},
);

// Add a display name for better debugging (optional but recommended)
DataInput.displayName = 'DataInput';

export default DataInput;
