import useServerCookie from '@/app/hooks/useServerCookie';
import type { UserData } from '@/app/types';
import { defaultCategories, USER } from '@/app/constants';

export default function Categories() {
	const [userCookieData] = useServerCookie<UserData>(USER);

	return (
		<div>
			<h3>Default Categories</h3>

			<ul className="list-disc">
				{defaultCategories.map((category) => (
					<li className="py-0 my-0" key={category}>
						{category}
					</li>
				))}
			</ul>
		</div>
	);
}
