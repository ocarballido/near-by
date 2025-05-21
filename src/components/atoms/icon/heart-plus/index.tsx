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

const IconHeartPlus = ({ color = 'body', size = 24 }: IconProps) => {
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
			<g mask="url(#mask0_4_4084)">
				<path d="M18 17V14H15V12H18V9H20V12H23V14H20V17H18ZM11 21L7.825 18.15C6.625 17.0667 5.59583 16.1 4.7375 15.25C3.87917 14.4 3.17083 13.6 2.6125 12.85C2.05417 12.1 1.64583 11.375 1.3875 10.675C1.12917 9.975 1 9.24167 1 8.475C1 6.90833 1.525 5.60417 2.575 4.5625C3.625 3.52083 4.93333 3 6.5 3C7.36667 3 8.19167 3.17917 8.975 3.5375C9.75833 3.89583 10.4333 4.40833 11 5.075C11.5667 4.40833 12.2417 3.89583 13.025 3.5375C13.8083 3.17917 14.6333 3 15.5 3C16.9167 3 18.1042 3.42917 19.0625 4.2875C20.0208 5.14583 20.6167 6.15 20.85 7.3C20.55 7.18333 20.25 7.09583 19.95 7.0375C19.65 6.97917 19.3583 6.95 19.075 6.95C17.3917 6.95 15.9583 7.5375 14.775 8.7125C13.5917 9.8875 13 11.3167 13 13C13 13.8667 13.175 14.6875 13.525 15.4625C13.875 16.2375 14.3667 16.9 15 17.45C14.6833 17.7333 14.2708 18.0958 13.7625 18.5375C13.2542 18.9792 12.8167 19.3667 12.45 19.7L11 21Z" />
			</g>
		</svg>
	);
};

export default IconHeartPlus;
