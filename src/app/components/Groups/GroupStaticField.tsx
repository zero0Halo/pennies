import classNames from 'classnames';
import type React from 'react';

const GroupStaticField: React.FC<{
	className?: string;
	label: string;
	value: string | string[];
}> = ({ className = '', label, value }) => {
	return (
		<div
			className={classNames(
				'flex items-center rounded-xl px-3 py-1 mb-2 bg-white',
				className,
			)}
		>
			<span className="font-bold text-xs pr-2">{label}:</span>
			<span className="text-sm">
				{Array.isArray(value) ? value.join(', ') : value}
			</span>
		</div>
	);
};

export default GroupStaticField;
