import type React from 'react';

const Field: React.FC<{
	alt: boolean;
	className?: string;
	label: string;
	value: string | string[];
}> = ({ alt, className = '', label, value }) => {
	let classes: string[] | string = [
		'flex items-center rounded-xl px-3 py-1 mb-2',
	];
	classes.push(alt ? 'bg-slate-100' : 'bg-white');
	classes.push(className);
	classes = classes.join(' ');

	return (
		<div className={classes}>
			<span className="font-bold text-xs pr-2">{label}:</span>
			<span className="text-sm">
				{Array.isArray(value) ? value.join(', ') : value}
			</span>
		</div>
	);
};

export default Field;
