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

const IconAcute = ({ color = 'body', size = 24 }: IconProps) => {
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
				<path d="M15 20C12.7667 20 10.875 19.225 9.325 17.675C7.775 16.125 7 14.2333 7 12C7 9.78333 7.775 7.89583 9.325 6.3375C10.875 4.77917 12.7667 4 15 4C17.2167 4 19.1042 4.77917 20.6625 6.3375C22.2208 7.89583 23 9.78333 23 12C23 14.2333 22.2208 16.125 20.6625 17.675C19.1042 19.225 17.2167 20 15 20ZM17.275 15.725L18.7 14.3L16 11.6V8H14V12.425L17.275 15.725ZM2 9V7H6V9H2ZM1 13V11H6V13H1ZM2 17V15H6V17H2Z" />
			</g>
		</svg>
	);
};

export default IconAcute;
