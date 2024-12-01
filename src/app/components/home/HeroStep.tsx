import Link from 'next/link';
import type { ReactElement } from 'react';

interface HeroStepArguments {
	link: string;
	linkText: string;
	subTitle?: string;
	title: string;
}

export default function HeroStep({
	link,
	linkText,
	subTitle,
	title,
}: HeroStepArguments): ReactElement {
	return (
		<div className="hero bg-accent">
			<div className="hero-content text-center pb-8">
				<div className="max-w-md">
					<h2>{title}</h2>
					{subTitle && <h3>{subTitle}</h3>}

					<Link href={link} className="btn btn-primary text-xl">
						{linkText}
					</Link>
				</div>
			</div>
		</div>
	);
}
