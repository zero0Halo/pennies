interface MessagesProps {
	defaultWarning: boolean;
	isDeleting: boolean;
	error: string;
	success: string;
}

const defaultWarningMsg =
	'You\'ve set this account to be your default, but there is already a default account. If you wish to proceed anyways, click the "Submit" button again.';
const deleteWarningMsg =
	'You are going to delete this account. If it is your default account, another account will be chosen at random to be your default. If you wish to proceed, click the "Delete" button again';

export default function Messages({
	defaultWarning,
	isDeleting,
	error,
	success,
}: MessagesProps) {
	let classes: string[] | string = ['alert font-bold my-1'];
	if (defaultWarning || isDeleting) classes.push('alert-warning');
	if (defaultWarning) classes.push('alert-warning');
	if (success.length || error.length) classes.push('text-white');
	if (success.length) classes.push('alert-success');
	if (error.length) classes.push('alert-error');
	classes = classes.join(' ');

	return (
		<div className={classes}>
			{defaultWarning && defaultWarningMsg}
			{isDeleting && deleteWarningMsg}
			{success.length > 0 && success}
			{error.length > 0 && error}
		</div>
	);
}
