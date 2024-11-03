import type React from 'react';

const Field: React.FC<{
	alt: boolean;
	label: string;
	value: string | string[];
}> = ({ alt, label, value }) => (
	<div
		className={`${alt ? 'bg-slate-100' : 'bg-white'} flex items-center rounded-xl px-3 py-1 mb-2`}
	>
		<span className="font-bold text-xs pr-2">{label}:</span>
		<span className="text-sm">
			{Array.isArray(value) ? value.join(', ') : value}
		</span>
	</div>
);

export default Field;
