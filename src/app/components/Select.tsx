import React from 'react';

type Option = string | { name: string; value: string };

type SelectProps = {
	className?: string;
	options: Option[];
} & React.SelectHTMLAttributes<HTMLSelectElement>;

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
	({ className = '', options = [], ...rest }, ref) => {
		const classes = [
			'select select-sm grow font-normal text-sm',
			className,
		].join();

		return (
			<select className={classes} ref={ref} {...rest}>
				{options.map((option) => {
					const name = typeof option === 'string' ? option : option?.name;
					const value = typeof option === 'string' ? option : option?.value;

					return (
						<option key={value} value={value}>
							{name}
						</option>
					);
				})}
			</select>
		);
	},
);
Select.displayName = 'Select';

export default Select;
