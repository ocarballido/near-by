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

const IconInterests = ({ color = 'body', size = 24 }: IconProps) => {
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
			<g mask="url(#mask0_61_11234)">
				<path d="M2 11L7 2L12 11H2ZM7 21C5.9 21 4.95833 20.6083 4.175 19.825C3.39167 19.0417 3 18.1 3 17C3 15.9 3.39167 14.9583 4.175 14.175C4.95833 13.3917 5.9 13 7 13C8.1 13 9.04167 13.3917 9.825 14.175C10.6083 14.9583 11 15.9 11 17C11 18.1 10.6083 19.0417 9.825 19.825C9.04167 20.6083 8.1 21 7 21ZM13 21V13H21V21H13ZM17 11C16.05 10.2 15.2542 9.525 14.6125 8.975C13.9708 8.425 13.4583 7.94167 13.075 7.525C12.6917 7.10833 12.4167 6.71667 12.25 6.35C12.0833 5.98333 12 5.59167 12 5.175C12 4.425 12.2625 3.79167 12.7875 3.275C13.3125 2.75833 13.9667 2.5 14.75 2.5C15.2 2.5 15.6208 2.60417 16.0125 2.8125C16.4042 3.02083 16.7333 3.30833 17 3.675C17.2667 3.30833 17.5958 3.02083 17.9875 2.8125C18.3792 2.60417 18.8 2.5 19.25 2.5C20.0333 2.5 20.6875 2.75833 21.2125 3.275C21.7375 3.79167 22 4.425 22 5.175C22 5.59167 21.9167 5.98333 21.75 6.35C21.5833 6.71667 21.3083 7.10833 20.925 7.525C20.5417 7.94167 20.0292 8.425 19.3875 8.975C18.7458 9.525 17.95 10.2 17 11Z" />
			</g>
		</svg>
	);
};

export default IconInterests;
