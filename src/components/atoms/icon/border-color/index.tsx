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

const IconBorderColor = ({ color = 'body', size = 24 }: IconProps) => {
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
			<g mask="url(#mask0_4_1571)">
				<path d="M2 24V20H22V24H2ZM4 18V13.75L15.2 2.575C15.3833 2.39167 15.5958 2.25 15.8375 2.15C16.0792 2.05 16.3333 2 16.6 2C16.8667 2 17.125 2.05 17.375 2.15C17.625 2.25 17.85 2.4 18.05 2.6L19.425 4C19.625 4.18333 19.7708 4.4 19.8625 4.65C19.9542 4.9 20 5.15833 20 5.425C20 5.675 19.9542 5.92083 19.8625 6.1625C19.7708 6.40417 19.625 6.625 19.425 6.825L8.25 18H4ZM16.6 6.8L18 5.4L16.6 4L15.2 5.4L16.6 6.8Z" />
			</g>
		</svg>
	);
};

export default IconBorderColor;
