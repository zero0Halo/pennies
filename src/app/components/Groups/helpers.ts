import { TRANSFER } from '@/app/constants';
import type { AccountData, GroupData } from '@/app/types';

export function getCategoryText(
	group: GroupData,
	getAccountByUid: ((arg: string) => AccountData | null) | null,
): string {
	if (!group || !getAccountByUid) return '';

	return group.category !== TRANSFER
		? group.category
		: `${TRANSFER} to ${getAccountByUid(group.transfer_uid as string)?.name ?? ''}`;
}
