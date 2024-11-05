import type { FindGroupsData, GroupData, TransactionData } from '@/app/types';

interface UpdateStateArgs {
	state: FindGroupsData | undefined;
	updatedGroup: GroupData;
	updatedTransactions: TransactionData[];
}

export default function updateState({
	state,
	updatedGroup,
	updatedTransactions,
}: UpdateStateArgs) {
	if (state) {
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
