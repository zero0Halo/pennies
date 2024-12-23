import type React from 'react';

type TabPanelData = {
	checked?: boolean;
	jsx: React.ReactNode;
	name?: string;
	title: string;
};

interface TabListProps {
	name: string;
	panels: TabPanelData[];
}

function TabPanel({
	jsx,
	checked,
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
				className="tab-content bg-base-100 border-base-300 rounded-box px-2 py-6"
			>
				{jsx}
			</div>
		</>
	);
}

export default function TabList({
	name,
	panels,
}: TabListProps): React.ReactNode {
	return (
		<div role="tablist" className="tabs tabs-lifted">
			{panels.map((panelData, index) => (
				<TabPanel
					key={panelData.title}
					{...panelData}
					checked={index === 0}
					name={name}
				/>
			))}{' '}
		</div>
	);
}
