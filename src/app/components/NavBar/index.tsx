import Image from 'next/image';
import Link from 'next/link';
import useIsLoggedIn from '../../hooks/useIsLoggedIn';
import SignIn from '../SignIn';
import SignOut from '../SignOut';
import NavLink from './NavLink';

export default function LoginBar() {
	const isLoggedIn = useIsLoggedIn();

	return (
		<nav className="navbar px-8 bg-neutral">
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
			</div>

			{isLoggedIn && <SignOut />}
			{!isLoggedIn && <SignIn />}
		</nav>
	);
}
