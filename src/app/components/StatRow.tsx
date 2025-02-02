import classNames from 'classnames';
import type React from 'react';

type StatItemData =
	| string
	| number
	| {
			className?: string;
			displayText: string | number;
	  };

type StatData = {
	className?: string;
	label: StatItemData;
	value: StatItemData | undefined;
};

interface StatRowProps {
	className?: string;
	stats: StatData[];
}

export default function StatRow({
	className,
	stats,
}: StatRowProps): React.ReactNode {
	const componentClasses = 'stats w-full bg-black text-white my-4';

	return (
		<div className={classNames(componentClasses, className)}>
			{stats.map((stat) => {
				const labelAndkey =
					typeof stat.label === 'object' ? stat.label.displayText : stat.label;
				const value =
					typeof stat.value === 'object' ? stat.value.displayText : stat.value;
				const labelClasses =
					typeof stat.label === 'object' ? stat.label.className : undefined;
				const valueClasses =
					typeof stat.value === 'object' ? stat.value.className : undefined;

				return (
					<div
						className={classNames('stat justify-items-center', stat?.className)}
						key={labelAndkey}
					>
						<span className={classNames('stat-title text-white', labelClasses)}>
							{labelAndkey}
						</span>
						<span className={classNames('stat-value text-white', valueClasses)}>
							{value}
						</span>
					</div>
				);
			})}
		</div>
	);
}
