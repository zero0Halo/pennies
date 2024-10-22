'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

export default function NavLink({
	children,
	exact,
	href,
}: { exact?: boolean; href: string; children: ReactNode }) {
	const pathname = usePathname(); // Get the current path
	// If exact, do an exact comparison. Otherwise use startsWith()
	const isActive = exact ? pathname === href : pathname.startsWith(href);

	return (
		<Link
			className={isActive ? 'text-white mx-2 px-4' : 'text-black mx-2 px-4'}
			href={href}
		>
			{children}
		</Link>
	);
}
