import type { CreateTransferPayloadData, FindGroupsData } from '@/app/types';

interface UpdateStateArgs {
	payload: CreateTransferPayloadData;
	state: FindGroupsData | undefined;
}

export default function updateState({
	payload: { group: updatedGroup, transactions: updatedTransactions },
	state,
}: UpdateStateArgs) {
	if (state && updatedGroup && updatedTransactions) {
		const newState = {
			groups: [...state.groups],
			singletons: [...state.singletons],
			total: state.total,
		};
		const groupIndex = newState?.groups.findIndex(
			({ group }) => group.uid === updatedGroup.uid,
		);

		newState.groups.splice(groupIndex, 1, {
			group: updatedGroup,
			transactions: updatedTransactions,
		});

		return newState;
	}

	return state;
}
