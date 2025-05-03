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

const IconTrain = ({ color = 'body', size = 24 }: IconProps) => {
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
			<g mask="url(#mask0_60_17029)">
				<path d="M4 15.5V6C4 5.11667 4.22917 4.4125 4.6875 3.8875C5.14583 3.3625 5.75 2.9625 6.5 2.6875C7.25 2.4125 8.10417 2.22917 9.0625 2.1375C10.0208 2.04583 11 2 12 2C13.1 2 14.1375 2.04583 15.1125 2.1375C16.0875 2.22917 16.9375 2.4125 17.6625 2.6875C18.3875 2.9625 18.9583 3.3625 19.375 3.8875C19.7917 4.4125 20 5.11667 20 6V15.5C20 16.4833 19.6625 17.3125 18.9875 17.9875C18.3125 18.6625 17.4833 19 16.5 19L18 20.5V21H16L14 19H10L8 21H6V20.5L7.5 19C6.51667 19 5.6875 18.6625 5.0125 17.9875C4.3375 17.3125 4 16.4833 4 15.5ZM6 10H11V7H6V10ZM13 10H18V7H13V10ZM8.5 16C8.93333 16 9.29167 15.8583 9.575 15.575C9.85833 15.2917 10 14.9333 10 14.5C10 14.0667 9.85833 13.7083 9.575 13.425C9.29167 13.1417 8.93333 13 8.5 13C8.06667 13 7.70833 13.1417 7.425 13.425C7.14167 13.7083 7 14.0667 7 14.5C7 14.9333 7.14167 15.2917 7.425 15.575C7.70833 15.8583 8.06667 16 8.5 16ZM15.5 16C15.9333 16 16.2917 15.8583 16.575 15.575C16.8583 15.2917 17 14.9333 17 14.5C17 14.0667 16.8583 13.7083 16.575 13.425C16.2917 13.1417 15.9333 13 15.5 13C15.0667 13 14.7083 13.1417 14.425 13.425C14.1417 13.7083 14 14.0667 14 14.5C14 14.9333 14.1417 15.2917 14.425 15.575C14.7083 15.8583 15.0667 16 15.5 16Z" />
			</g>
		</svg>
	);
};

export default IconTrain;
