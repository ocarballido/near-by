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

const IconQrCode = ({ color = 'body', size = 24 }: IconProps) => {
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
				<path d="M3 11V3H11V11H3ZM5 9H9V5H5V9ZM3 21V13H11V21H3ZM5 19H9V15H5V19ZM13 11V3H21V11H13ZM15 9H19V5H15V9ZM19 21V19H21V21H19ZM13 15V13H15V15H13ZM15 17V15H17V17H15ZM13 19V17H15V19H13ZM15 21V19H17V21H15ZM17 19V17H19V19H17ZM17 15V13H19V15H17ZM19 17V15H21V17H19Z" />
			</g>
		</svg>
	);
};

export default IconQrCode;
