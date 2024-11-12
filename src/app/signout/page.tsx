'use client';

import { useEffect } from 'react';
import { CSV_UPLOAD } from '../constants';
import Link from 'next/link';

export default function Home() {
	useEffect(() => {
		localStorage.removeItem(CSV_UPLOAD);
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
