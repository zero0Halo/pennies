import classNames from 'classnames';
import React, { useState, type ReactNode } from 'react';

interface TabPanelProps {
	title: string;
	children: ReactNode;
}

export const TabPanel: React.FC<TabPanelProps> = ({ children }) => {
	return <div>{children}</div>;
};

interface TabListProps {
	children: ReactNode;
}

const TabList2: React.FC<TabListProps> = ({ children }) => {
	const [activeTab, setActiveTab] = useState(0);

	const tabs = React.Children.toArray(children)
		.filter((child) => React.isValidElement(child) && 'title' in child.props)
		.map((child) => ({
			title: (child as React.ReactElement<TabPanelProps>).props.title,
			content: child,
		}));

	return (
		<div className="mb-8">
			<div className="mb-[-2px] relative">
				{tabs.map((tab, index) => (
					<button
						className={classNames(
							'border-2 rounded-tl-md rounded-tr-md px-4',
							index === activeTab
								? 'border-b-white font-bold bg-white'
								: 'bg-slate-200',
						)}
						key={`${index}-${tab.title}`}
						onClick={() => setActiveTab(index)}
						type="button"
					>
						{tab.title}
					</button>
				))}
			</div>

			<div className="border-2 rounded-lg rounded-tl-none">
				{tabs.map((tab, index) => (
					<div
						className={classNames(
							index === activeTab ? 'block' : 'hidden',
							'p-4',
						)}
						key={`${index}-${tab.title}`}
					>
						{tab.content}
					</div>
				))}
			</div>
		</div>
	);
};

export default TabList2;
