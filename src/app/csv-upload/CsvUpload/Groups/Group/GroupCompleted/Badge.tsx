import type React from 'react';

const Badge: React.FC<{
	alt: boolean;
	label: string | boolean;
}> = ({ alt, label }) => (
	<div className={`badge bg-${alt ? 'slate-100' : 'white'} badge-sm ml-2 h-6`}>
		{label}
	</div>
);

export default Badge;
