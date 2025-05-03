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

const IconLocalDining = ({ color = 'body', size = 24 }: IconProps) => {
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
			<g mask="url(#mask0_60_17034)">
				<path d="M4.375 21L2.975 19.6L13.225 9.35C12.925 8.65 12.8833 7.85833 13.1 6.975C13.3167 6.09167 13.7917 5.3 14.525 4.6C15.4083 3.71667 16.3917 3.2 17.475 3.05C18.5583 2.9 19.4417 3.16667 20.125 3.85C20.8083 4.53333 21.075 5.41667 20.925 6.5C20.775 7.58333 20.2583 8.56667 19.375 9.45C18.675 10.1833 17.8833 10.6583 17 10.875C16.1167 11.0917 15.325 11.05 14.625 10.75L13.375 12L20.975 19.6L19.575 21L11.975 13.45L4.375 21ZM7.325 12.45L4.325 9.45C3.425 8.55 2.975 7.475 2.975 6.225C2.975 4.975 3.425 3.9 4.325 3L10.525 9.25L7.325 12.45Z" />
			</g>
		</svg>
	);
};

export default IconLocalDining;
