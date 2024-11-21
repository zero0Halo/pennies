import type { ReactNode } from 'react';
import Link from 'next/link';

interface HomeHeroArgs {
	heading: string;
	linkText: string;
	linkUrl: string;
	subHeading?: string | undefined;
}

export default function HomeHero({
	heading,
	linkText,
	linkUrl,
	subHeading,
}: HomeHeroArgs): ReactNode {
	return (
		<div className="hero bg-accent">
			<div className="hero-content text-center pb-8">
				<div className="max-w-md">
					<h2>{heading}</h2>

					{subHeading && <h3>{subHeading}</h3>}

					<Link href={linkUrl} className="btn btn-primary">
						{linkText}
					</Link>
				</div>
			</div>
		</div>
	);
}
