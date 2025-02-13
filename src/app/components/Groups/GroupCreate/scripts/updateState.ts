import type { CreateTransferPayloadData, ParseCSVData } from '@/app/types';

interface UpdateStateArgs {
	payload: CreateTransferPayloadData;
	state: ParseCSVData | undefined;
}

export default function updateState({
	payload: { group: updatedGroup, transactions: updatedTransactions },
	state,
}: UpdateStateArgs): ParseCSVData | undefined {
	if (
		state !== undefined &&
		state.groups !== null &&
		state.singletons !== null &&
		updatedGroup &&
		updatedTransactions
	) {
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
