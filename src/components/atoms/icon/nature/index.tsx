import clsx from 'clsx';

import styles from '../styles.module.css';

type IconProps = {
	size?: number;
	color?:
		| 'primary'
		| 'secondary'
		| 'success'
		| 'warning'
		| 'info'
		| 'error'
		| 'body'
		| 'light'
		| 'white';
};

const IconNature = ({ color = 'body', size = 24 }: IconProps) => {
	const iconStyles = clsx({
		[styles['icon--primary']]: color === 'primary',
		[styles['icon--secondary']]: color === 'secondary',
		[styles['icon--success']]: color === 'success',
		[styles['icon--warning']]: color === 'warning',
		[styles['icon--info']]: color === 'info',
		[styles['icon--error']]: color === 'error',
		[styles['icon--body']]: color === 'body',
		[styles['icon--light']]: color === 'light',
		[styles['icon--white']]: color === 'white',
	});

	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={iconStyles}
		>
			<mask
				id="mask0_3_666"
				maskUnits="userSpaceOnUse"
				x="0"
				y="0"
				width={size}
				height={size}
			>
				<rect width={size} height={size} fill="#D9D9D9" />
			</mask>
			<g mask="url(#mask0_60_17036)">
				<path d="M5 22V20H11V16H9C7.61667 16 6.4375 15.5125 5.4625 14.5375C4.4875 13.5625 4 12.3833 4 11C4 10 4.275 9.07917 4.825 8.2375C5.375 7.39583 6.11667 6.78333 7.05 6.4C7.2 5.15 7.74583 4.10417 8.6875 3.2625C9.62917 2.42083 10.7333 2 12 2C13.2667 2 14.3708 2.42083 15.3125 3.2625C16.2542 4.10417 16.8 5.15 16.95 6.4C17.8833 6.78333 18.625 7.39583 19.175 8.2375C19.725 9.07917 20 10 20 11C20 12.3833 19.5125 13.5625 18.5375 14.5375C17.5625 15.5125 16.3833 16 15 16H13V20H19V22H5Z" />
			</g>
		</svg>
	);
};

export default IconNature;
