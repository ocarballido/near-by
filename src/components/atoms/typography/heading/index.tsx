import clsx from 'clsx';

import styles from './styles.module.css';

type HeadingTypeProps = {
	className?: string;
	children?: string;
	component?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
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
	variant?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
};

const HeadingType = ({
	className = '',
	children = '',
	color = 'body',
	component: Component = 'h6',
	variant = 'md',
}: HeadingTypeProps) => {
	const headingTypeStyles = clsx(
		{
			[styles['heading__type--xs']]: variant === 'xs',
			[styles['heading__type--sm']]: variant === 'sm',
			[styles['heading__type--md']]: variant === 'md',
			[styles['heading__type--lg']]: variant === 'lg',
			[styles['heading__type--xl']]: variant === 'xl',
			[styles['heading__type--xxl']]: variant === 'xxl',
			[styles['heading__type--primary']]: color === 'primary',
			[styles['heading__type--secondary']]: color === 'secondary',
			[styles['heading__type--success']]: color === 'success',
			[styles['heading__type--warning']]: color === 'warning',
			[styles['heading__type--info']]: color === 'info',
			[styles['heading__type--error']]: color === 'error',
			[styles['heading__type--body']]: color === 'body',
			[styles['heading__type--light']]: color === 'light',
			[styles['heading__type--black']]: color === 'black',
			[styles['heading__type--white']]: color === 'white',
		},
		className
	);

	return (
		<Component className={`${headingTypeStyles} font-heading font-bold`}>
			{children}
		</Component>
	);
};

export default HeadingType;
