import type React from 'react';
import { useEffect, useRef, useState } from 'react';

type ButtonToggleData = {
	label: string;
	classes?: string;
};

interface ButtonTogglesProps {
	buttons: ButtonToggleData[];
	className?: string;
	onClick: (args: string) => void;
}

export default function ButtonToggles({
	buttons,
	className = '',
	onClick,
}: ButtonTogglesProps): React.ReactNode {
	if (!Array.isArray(buttons)) return null;

	// State
	const [active, setActive] = useState(0);

	// Ref
	const firstLoad = useRef<boolean>(true);

	// Shugah
	const baseClasses = 'btn btn-sm join-item font-bold';
	const activeClasses = `${baseClasses} bg-success toggle-inset text-white`;
	const inactiveClasses = `${baseClasses} bg-primary`;

	// Event handlers
	const handleClick = (index: number) => {
		setActive(index);

		if (typeof onClick === 'function') onClick(buttons[index].label);
	};

	// Effects
	useEffect(() => {
		// On mounting run the onClick event with the first button selected
		if (
			firstLoad.current === true &&
			typeof onClick === 'function' &&
			Array.isArray(buttons)
		) {
			onClick(buttons[0].label);
			firstLoad.current = false;
		}
	}, [buttons, onClick]);

	// JSX
	return (
		<div
			className={`join join-horizontal border-primary border-2 shadow my-2 ${className ?? className}`}
		>
			{buttons.map((button, index) => (
				<button
					className={active === index ? activeClasses : inactiveClasses}
					key={button.label}
					onClick={() => handleClick(index)}
					type="button"
				>
					{button.label}
				</button>
			))}
		</div>
	);
}
