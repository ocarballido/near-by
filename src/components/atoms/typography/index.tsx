import React from 'react';
import clsx from 'clsx';

// Etiquetas HTML permitidas
type ComponentTag =
	| 'h1'
	| 'h2'
	| 'h3'
	| 'h4'
	| 'h5'
	| 'h6'
	| 'p'
	| 'span'
	| 'blockquote'
	| 'label'
	| 'small'
	| 'strong'
	| 'em'
	| 'div';

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
	component?: ComponentTag;
	size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
	weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
	color?: string; // e.g., 'text-gray-900'
	lineHeight?: 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose';
	fontFamily?: 'base' | 'body';
	className?: string;
	children: React.ReactNode;
}

// Escalas tipográficas (golden ratio)
const SIZE_CLASSES: Record<NonNullable<TypographyProps['size']>, string> = {
	xs: 'text-[0.618rem]', // ~10px
	sm: 'text-sm', // ~14px
	base: 'text-base', // 16px
	lg: 'text-[1.618rem]', // ~26px
	xl: 'text-[2.618rem]', // ~42px
	'2xl': 'text-[4.236rem]', // ~68px
	'3xl': 'text-[6.854rem]', // ~109px
};

const WEIGHT_CLASSES: Record<NonNullable<TypographyProps['weight']>, string> = {
	light: 'font-light',
	normal: 'font-normal',
	medium: 'font-medium',
	semibold: 'font-semibold',
	bold: 'font-bold',
};

const LINE_HEIGHT_CLASSES: Record<
	NonNullable<TypographyProps['lineHeight']>,
	string
> = {
	tight: 'leading-tight',
	snug: 'leading-snug',
	normal: 'leading-normal',
	relaxed: 'leading-relaxed',
	loose: 'leading-loose',
};

const FONT_CLASSES: Record<
	NonNullable<TypographyProps['fontFamily']>,
	string
> = {
	base: 'font-heading',
	body: 'font-body',
};

// 💡 Defaults por etiqueta
const DEFAULT_FONT_WEIGHT: Partial<
	Record<ComponentTag, TypographyProps['weight']>
> = {
	h1: 'bold',
	h2: 'bold',
	h3: 'bold',
	h4: 'bold',
	h5: 'bold',
	h6: 'bold',
	p: 'normal',
	span: 'normal',
	div: 'normal',
	label: 'normal',
	blockquote: 'normal',
	strong: 'bold',
	small: 'normal',
	em: 'normal',
};

const DEFAULT_FONT_FAMILY: Partial<
	Record<ComponentTag, TypographyProps['fontFamily']>
> = {
	h1: 'base',
	h2: 'base',
	h3: 'base',
	h4: 'base',
	h5: 'base',
	h6: 'base',
	p: 'body',
	span: 'body',
	div: 'body',
	label: 'body',
	blockquote: 'body',
	strong: 'body',
	small: 'body',
	em: 'body',
};

const DEFAULT_SIZE: Partial<Record<ComponentTag, TypographyProps['size']>> = {
	h1: '3xl',
	h2: '2xl',
	h3: 'xl',
	h4: 'lg',
	h5: 'base',
	h6: 'sm',
	p: 'base',
	span: 'base',
	small: 'xs',
	label: 'sm',
	blockquote: 'xl',
};

const Typography: React.FC<TypographyProps> = ({
	component = 'p',
	size, // 👈 sin default
	weight,
	color = 'text-gray-800',
	lineHeight = 'normal',
	fontFamily,
	className,
	children,
	...rest
}) => {
	const Tag = component;

	const resolvedWeight = weight ?? DEFAULT_FONT_WEIGHT[component] ?? 'normal';
	const resolvedFontFamily =
		fontFamily ?? DEFAULT_FONT_FAMILY[component] ?? 'body';
	const resolvedSize = size ?? DEFAULT_SIZE[component] ?? 'base';

	const classes = clsx(
		SIZE_CLASSES[resolvedSize],
		WEIGHT_CLASSES[resolvedWeight],
		LINE_HEIGHT_CLASSES[lineHeight],
		FONT_CLASSES[resolvedFontFamily],
		color,
		className,
	);

	return (
		<Tag className={classes} {...rest}>
			{children}
		</Tag>
	);
};

export default Typography;
