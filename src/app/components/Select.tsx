import classNames from 'classnames';
import React from 'react';

const sizes = ['select-xs', 'select-sm', 'select-md', 'select-lg', 'select-xl'];

type Option = string | { name: string; value: string };

type SelectProps = {
	className?: string;
	options: Option[];
} & React.SelectHTMLAttributes<HTMLSelectElement>;

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
	({ className = '', options = [], ...rest }, ref) => {
		const sizeCheck = className.split(' ').find((f) => sizes.includes(f));
		const baseStyles = `select grow font-normal text-sm${!sizeCheck ? ' select-sm' : ''}`;

		const classes = classNames([baseStyles, className]);

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
