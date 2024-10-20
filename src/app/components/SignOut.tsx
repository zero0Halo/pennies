'use client';

import { useState } from 'react';
import Cookie from 'js-cookie';
import type { SignOutData, UserData } from '../types';

export default function SignOut() {
	const [error, setError] = useState('');
	const userCookie: string | object = Cookie.get('user') ?? '';
	let user: UserData | boolean;

	try {
		user = JSON.parse(userCookie);
	} catch {
		user = false;
		setError('Error parsing User JSON');
	}

	async function handleSignOut(event: SignOutData) {
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
					Logout{' '}
					{typeof user !== 'boolean' && `${user.first_name} ${user.last_name}`}
				</button>
			) : (
				<div>{error}</div>
			)}
		</div>
	);
}
