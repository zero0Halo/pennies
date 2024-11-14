import { responseFactory, toReturn } from '@/utils/api';
import type { GroupData, ReturnData } from '@/app/types';

interface GroupsExistArgs {
	data: { description: string }[] | undefined | null;
	group: GroupData;
}

export default async function groupsExist({
	data,
	group,
}: GroupsExistArgs): Promise<ReturnData> {
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
