import CustomCategories from './CustomCategories';
import { useServerCookie } from '@/app/hooks/server';
import type { UserData } from '@/app/types';
import { defaultCategories, USER } from '@/app/constants';

export default function Categories() {
	const [userCookieData] = useServerCookie<UserData>(USER);
	const uid =
		typeof userCookieData === 'object'
			? (userCookieData as UserData).uid
			: false;

	return (
		<div className="flex">
			<div className="w-3/12 pr-4">
				<h3>Default Categories</h3>

				<ul className="list-disc">
					{defaultCategories.map((category) => (
						<li className="py-0 my-0" key={category}>
							{category}
						</li>
					))}
				</ul>
			</div>

			<div className="w-9/12">
				<h3>Custom Categories</h3>

				<CustomCategories uid={uid} />
			</div>
		</div>
	);
}
