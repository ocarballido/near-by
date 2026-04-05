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

const IconWifi = ({ color = 'body', size = 24 }: IconProps) => {
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
			<g mask="url(#mask0_845_10212)">
				<path d="M2.72498 10.725L0.599976 8.6C2.13331 7.11667 3.88331 5.97917 5.84998 5.1875C7.81664 4.39583 9.86664 4 12 4C14.1333 4 16.1833 4.39583 18.15 5.1875C20.1166 5.97917 21.8666 7.11667 23.4 8.6L21.275 10.725C20.025 9.525 18.6 8.60417 17 7.9625C15.4 7.32083 13.7333 7 12 7C10.2666 7 8.59998 7.32083 6.99998 7.9625C5.39998 8.60417 3.97498 9.525 2.72498 10.725ZM6.94998 14.95L4.84998 12.85C5.83331 11.9333 6.93748 11.2292 8.16248 10.7375C9.38748 10.2458 10.6666 10 12 10C13.3333 10 14.6125 10.2458 15.8375 10.7375C17.0625 11.2292 18.1666 11.9333 19.15 12.85L17.05 14.95C16.35 14.3167 15.5708 13.8333 14.7125 13.5C13.8541 13.1667 12.95 13 12 13C11.05 13 10.1458 13.1667 9.28748 13.5C8.42914 13.8333 7.64998 14.3167 6.94998 14.95ZM10.5875 19.4125C10.1958 19.0208 9.99998 18.55 9.99998 18C9.99998 17.45 10.1958 16.9792 10.5875 16.5875C10.9791 16.1958 11.45 16 12 16C12.55 16 13.0208 16.1958 13.4125 16.5875C13.8041 16.9792 14 17.45 14 18C14 18.55 13.8041 19.0208 13.4125 19.4125C13.0208 19.8042 12.55 20 12 20C11.45 20 10.9791 19.8042 10.5875 19.4125Z" />
			</g>
		</svg>
	);
};

export default IconWifi;
