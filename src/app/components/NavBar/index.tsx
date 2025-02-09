import Image from 'next/image';
import Link from 'next/link';
import SignIn from './SignIn';
import SignOut from './SignOut';
import NavLink from './NavLink';
import { useIsLoggedIn } from '@/app/hooks/server';

export default function LoginBar() {
	const isLoggedIn = useIsLoggedIn();

	return (
		<nav className="navbar px-8 bg-neutral sticky top-0 z-50">
			<div className="flex-1">
				<Link href="/">
					<Image
						alt="A Pig With A Coin in its Back"
						className="my-0"
						height="32"
						src="/images/savings.svg"
						width="32"
					/>
				</Link>

				<h1 className="my-0 pl-2 text-2xl">Pennies</h1>

				<NavLink exact href="/">
					Home
				</NavLink>

				<NavLink href="/accounts">Accounts</NavLink>

				<NavLink href="/categories">Categories</NavLink>

				<NavLink href="/csv-upload">CSV Upload</NavLink>
			</div>

			{isLoggedIn && <SignOut />}
			{!isLoggedIn && <SignIn />}
		</nav>
	);
}
