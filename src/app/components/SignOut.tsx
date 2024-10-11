'use client';

import { useState } from 'react';

interface SignOutProps {
	preventDefault: () => void;
}

export default function SignOut() {
	const [error, setError] = useState('');

	async function handleSignOut(event: SignOutProps) {
		event.preventDefault();

		const response = await fetch('/api/user-signout', {
			method: 'POST',
		});

		if (response.ok) {
			window.location.href = '/';
		} else {
			setError(`Sign out failed: ${response.statusText}`);
		}
	}

	return (
		<div>
			{error.length === 0 ? (
				<button
					className="btn btn-primary btn-xs"
					onClick={handleSignOut}
					type="button"
				>
					Logout
				</button>
			) : (
				<div>{error}</div>
			)}
		</div>
	);
}
