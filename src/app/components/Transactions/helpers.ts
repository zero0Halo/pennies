import classNames from 'classnames';

export const tableClasses = (tableClassName?: string) =>
	classNames('table table-fixed rounded-lg  mt-0', tableClassName);

export const tdOverflow = (tdClassName?: string) =>
	classNames(
		'overflow-x-hidden whitespace-nowrap text-ellipsisclassNames',
		tdClassName,
	);

export const thClasses = (i: number) => `text-white text-sm py-1 w-${i}/12`;

export const tdClasses = (i: number) => `w-${i}/12`;
