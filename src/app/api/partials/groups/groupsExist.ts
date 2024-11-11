import type { GroupData } from '@/app/types';
import toReturn from '../../utils/toReturn';
import responseFactory from '../../utils/responseFactory';

export default async function groupsExist(
	data: { description: string }[] | undefined | null,
	group: GroupData,
) {
	if (data) {
		const descriptions = data?.map((m) => m.description);
		const exists = descriptions.includes(group.description);

		return toReturn({
			error: !exists
				? null
				: responseFactory('A Group With This Prime Already Exists'),
		});
	}

	return toReturn({ error: responseFactory('No Descriptions Were Given') });
}
