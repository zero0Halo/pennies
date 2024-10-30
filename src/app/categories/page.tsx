import { redirect } from 'next/navigation';
import useIsLoggedIn from '@/app/hooks/useIsLoggedIn';
import Categories from './components/Categories';

export default function CategoriesPage() {
	const isLoggedIn = useIsLoggedIn();

	if (!isLoggedIn) redirect('/');

	return (
		<div>
			<h2>Categories</h2>

			<Categories />
		</div>
	);
}
