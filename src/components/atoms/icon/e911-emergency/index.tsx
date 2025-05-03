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

const IconEmergency = ({ color = 'body', size = 24 }: IconProps) => {
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
			<g mask="url(#mask0_60_17028)">
				<path d="M5 20V18H6.6L8.575 11.425C8.70833 10.9917 8.95417 10.6458 9.3125 10.3875C9.67083 10.1292 10.0667 10 10.5 10H13.5C13.9333 10 14.3292 10.1292 14.6875 10.3875C15.0458 10.6458 15.2917 10.9917 15.425 11.425L17.4 18H19V20H5ZM11 8V3H13V8H11ZM16.95 10.475L15.525 9.05L19.075 5.525L20.475 6.925L16.95 10.475ZM18 15V13H23V15H18ZM7.05 10.475L3.525 6.925L4.925 5.525L8.475 9.05L7.05 10.475ZM1 15V13H6V15H1Z" />
			</g>
		</svg>
	);
};

export default IconEmergency;
