interface ButtonGroupProps {
	isDeleting: boolean;
	isEditing: boolean;
	handleCancel: () => void;
	handleDelete: () => void;
	handleEdit: () => void;
	handleSubmitDelete: () => void;
	handleSubmitEdit: () => void;
}

interface ButtonProps {
	classNames: string;
	onClick: () => void;
	children: string;
}

const Button = ({ classNames, onClick, children }: ButtonProps) => {
	const btnClasses = 'btn btn-sm join-item w-1/2';

	return (
		<button
			className={`${btnClasses} ${classNames}`}
			onClick={onClick}
			type="button"
		>
			{children}
		</button>
	);
};

export default function ButtonGroup({
	handleCancel,
	handleDelete,
	handleEdit,
	handleSubmitDelete,
	handleSubmitEdit,
	isDeleting,
	isEditing,
}: ButtonGroupProps) {
	return (
		<div className="join join-horizontal">
			{!isEditing && !isDeleting && (
				<>
					<Button classNames="btn-secondary mr-1" onClick={handleEdit}>
						Edit
					</Button>
					<Button classNames="btn-error" onClick={handleDelete}>
						Delete
					</Button>
				</>
			)}

			{isEditing && (
				<Button
					classNames="btn-success mr-1 text-white"
					onClick={handleSubmitEdit}
				>
					Edit
				</Button>
			)}

			{isDeleting && (
				<Button
					classNames="btn-error mr-1 text-white"
					onClick={handleSubmitDelete}
				>
					Delete
				</Button>
			)}

			{(isEditing || isDeleting) && (
				<Button classNames="btn-warning" onClick={handleCancel}>
					Cancel
				</Button>
			)}
		</div>
	);
}
