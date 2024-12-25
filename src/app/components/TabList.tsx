import React from 'react';

type TabPanelData = {
	checked?: boolean;
	children: React.ReactNode;
	name?: string;
	title?: string;
};

interface TabListProps {
	children: React.ReactNode;
	name: string;
}

function TabPanel({
	checked,
	children,
	name,
	title,
}: TabPanelData): React.ReactNode {
	return (
		<>
			<input
				aria-label={title}
				className="tab after:whitespace-nowrap"
				defaultChecked={checked}
				name={name}
				role="tab"
				type="radio"
			/>
			<div
				role="tabpanel"
				className="tab-content bg-base-100 border-base-300 rounded-box px-4 py-6"
			>
				{children}
			</div>
		</>
	);
}

export default function TabList({
	children,
	name,
}: TabListProps): React.ReactNode {
	return (
		<div role="tablist" className="tabs tabs-lifted">
			{React.Children.map(children, (child, index) => {
				if (React.isValidElement(child)) {
					return (
						<TabPanel
							checked={index === 0}
							name={name}
							title={child.props['data-title'] ?? `Tab Title ${index + 1}`}
						>
							{child}
						</TabPanel>
					);
				}
			})}
		</div>
	);
}
