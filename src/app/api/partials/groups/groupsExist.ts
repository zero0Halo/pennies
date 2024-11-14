import type { GroupData } from '@/app/types';
import toReturn from '../../../../utils/utils/toReturn';
import responseFactory from '../../../../utils/utils/responseFactory';

interface GroupsExistArgs {
	data: { description: string }[] | undefined | null;
	group: GroupData;
}

export default async function groupsExist({ data, group }: GroupsExistArgs) {
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
