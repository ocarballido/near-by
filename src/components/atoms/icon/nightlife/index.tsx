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

const IconNightLife = ({ color = 'body', size = 24 }: IconProps) => {
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
			<g mask="url(#mask0_60_17035)">
				<path d="M5 20V18H7V14L1 5H15L9 14V18H11V20H5ZM5.9 9H10.1L11.5 7H4.5L5.9 9ZM16 20C15.1667 20 14.4583 19.7083 13.875 19.125C13.2917 18.5417 13 17.8333 13 17C13 16.1667 13.2917 15.4583 13.875 14.875C14.4583 14.2917 15.1667 14 16 14C16.1833 14 16.3583 14.0125 16.525 14.0375C16.6917 14.0625 16.85 14.1167 17 14.2V5H22V8H19V17C19 17.8333 18.7083 18.5417 18.125 19.125C17.5417 19.7083 16.8333 20 16 20Z" />
			</g>
		</svg>
	);
};

export default IconNightLife;
