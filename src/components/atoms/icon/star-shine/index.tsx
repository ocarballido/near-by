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

const IconStarShine = ({ color = 'body', size = 24 }: IconProps) => {
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
				<path d="M21.3 18.7L18.3 15.7L19.7 14.3L22.7 17.3L21.3 18.7ZM17.7 6.7L16.3 5.3L19.3 2.3L20.7 3.7L17.7 6.7ZM6.29999 6.7L3.29999 3.7L4.69999 2.3L7.69999 5.3L6.29999 6.7ZM2.69999 18.7L1.29999 17.3L4.29999 14.3L5.69999 15.7L2.69999 18.7ZM5.82499 21L7.44999 13.975L1.99999 9.25L9.19999 8.625L12 2L14.8 8.625L22 9.25L16.55 13.975L18.175 21L12 17.275L5.82499 21Z" />
			</g>
		</svg>
	);
};

export default IconStarShine;
