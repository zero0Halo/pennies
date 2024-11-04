import React from 'react';

type SelectProps = {
	className?: string;
	options: string[];
} & React.SelectHTMLAttributes<HTMLSelectElement>;

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
	({ className = '', options = [], ...rest }, ref) => {
		const classes = [
			'select select-sm grow font-normal text-sm',
			className,
		].join();

		return (
			<select className={classes} ref={ref} {...rest}>
				{options.map((value) => (
					<option key={value} value={value}>
						{value}
					</option>
				))}
			</select>
		);
	},
);
Select.displayName = 'Select';

export default Select;
