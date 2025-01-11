'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import storage from '@/utils/app/storage';

export default function Home() {
	useEffect(() => {
		storage.removeAll();
	}, []);

	return (
		<div className="hero bg-accent">
			<div className="hero-content text-center pb-8">
				<div className="max-w-md">
					<h2>Successfully Logged Out!</h2>
					<h3>Go away now.</h3>

					<Link href="/" className="btn-sm btn btn-primary">
						Return Home
					</Link>
				</div>
			</div>
		</div>
	);
}
