import React from 'react';

type SelectProps = {
	fieldName: string;
	options: string[];
} & React.SelectHTMLAttributes<HTMLSelectElement>;

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
	({ options = [], ...rest }, ref) => {
		return (
			<select className="select select-sm grow font-normal" ref={ref} {...rest}>
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
