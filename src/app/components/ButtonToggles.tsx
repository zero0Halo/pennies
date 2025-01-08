import type React from 'react';

export type ToggleStateData = {
	[key: string]: boolean;
};

interface ButtonTogglesProps {
	className?: string;
	toggleState: ToggleStateData;
	setToggleState: React.Dispatch<React.SetStateAction<ToggleStateData>>;
}

export default function ButtonToggles({
	className = '',
	setToggleState,
	toggleState,
}: ButtonTogglesProps): React.ReactNode {
	// TW Shugah
	const btnBaseClasses = 'btn btn-sm join-item font-bold capitalize';
	const btnActiveClasses = `${btnBaseClasses} bg-success toggle-inset text-white`;
	const btnInactiveClasses = `${btnBaseClasses} bg-primary`;

	// Event handlers
	const handleClick = (label: string) => {
		const _toggleState: ToggleStateData = Object.keys(toggleState).reduce(
			(acc: ToggleStateData, current: string) => {
				acc[current] = current === label;
				return acc;
			},
			{},
		);

		setToggleState(_toggleState);
	};

	// JSX
	return (
		<div
			className={`join join-horizontal border-primary border-2 shadow ${className ?? className}`}
		>
			{Object.keys(toggleState).map((label) => (
				<button
					className={
						toggleState[label] === true ? btnActiveClasses : btnInactiveClasses
					}
					key={label}
					onClick={() => handleClick(label)}
					type="button"
				>
					{label}
				</button>
			))}
		</div>
	);
}
