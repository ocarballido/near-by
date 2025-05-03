import clsx from 'clsx';

import styles from './styles.module.css';

type bodyTypeProps = {
	align?: 'left' | 'center' | 'right';
	component?:
		| 'p'
		| 'span'
		| 'blockquote'
		| 'label'
		| 'small'
		| 'strong'
		| 'em'
		| 'div';
	className?: string;
	children?: React.ReactNode;
	variant?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
	weight?: 'regular' | 'medium' | 'bold';
	color?:
		| 'primary'
		| 'secondary'
		| 'success'
		| 'warning'
		| 'info'
		| 'error'
		| 'body'
		| 'light'
		| 'black'
		| 'white';
};

const BodyType = ({
	align = 'left',
	className = '',
	children = '',
	color = 'body',
	weight = 'regular',
	component: Component = 'p',
	variant = 'md',
}: bodyTypeProps) => {
	const bodyTypeStyles = clsx(
		{
			[styles['body__type--primary']]: color === 'primary',
			[styles['body__type--secondary']]: color === 'secondary',
			[styles['body__type--success']]: color === 'success',
			[styles['body__type--warning']]: color === 'warning',
			[styles['body__type--info']]: color === 'info',
			[styles['body__type--error']]: color === 'error',
			[styles['body__type--body']]: color === 'body',
			[styles['body__type--light']]: color === 'light',
			[styles['body__type--black']]: color === 'black',
			[styles['body__type--white']]: color === 'white',
		},
		{ 'text-xs': variant === 'xs' },
		{ 'text-sm': variant === 'sm' },
		{ 'text-md': variant === 'md' },
		{ 'text-lg': variant === 'lg' },
		{ 'text-xl': variant === 'xl' },
		{ 'text-xxl': variant === 'xxl' },
		{ 'font-regular': weight === 'regular' },
		{ 'font-medium': weight === 'medium' },
		{ 'font-bold': weight === 'bold' },
		{ 'text-left': align === 'left' },
		{ 'text-center': align === 'center' },
		{ 'text-right': align === 'right' },
		className
	);

	return (
		<Component className={`font-body ${bodyTypeStyles}`}>
			{children}
		</Component>
	);
};

export default BodyType;
