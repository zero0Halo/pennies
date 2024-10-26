interface AlertMessagesProps {
	defaultWarning: boolean;
	isDeleting: boolean;
	error: string;
	success: string;
}

const defaultMsg =
	'You\'ve set this account to be your default, but there is already a default account. If you wish to proceed anyways, click the "Edit" button again.';
const deleteMsg =
	'You are going to delete this account. If it is your default account, another account will be chosen at random to be your default. If you wish to proceed, click the "Delete" button again';

export default function AlertMessages({
	defaultWarning,
	isDeleting,
	error,
	success,
}: AlertMessagesProps) {
	const warningMessage = defaultWarning
		? defaultMsg
		: isDeleting
			? deleteMsg
			: false;
	const isSuccess = success.length > 0;
	const isError = error.length > 0;
	const restMessage = isError ? error : isSuccess ? success : false;
	let classes: string[] | string = ['alert font-bold my-1'];

	if (warningMessage && !restMessage) classes.push('alert-warning');
	if (restMessage && isSuccess) classes.push('alert-success text-white');
	if (restMessage && isError) classes.push('alert-error text-white');

	classes = classes.join(' ');

	return <div className={classes}>{restMessage || warningMessage}</div>;
}
