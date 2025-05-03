// 'use client';

import clsx from 'clsx';

// import { useRef } from 'react';

type CategoryBodyProps = {
	children: React.ReactNode;
	open: boolean;
};

const CategoryBody = ({ children, open = false }: CategoryBodyProps) => {
	// const bodyRef = useRef<HTMLDivElement>(null);

	const bodyStyles = clsx({ 'h-0': !open }, { 'h-auto': open });

	return (
		<div
			className={`flex flex-col w-full gap-2 transition-all duration-300 overflow-hidden ${bodyStyles}`}
			// className={`flex flex-col w-full gap-2 transition-all duration-300 overflow-hidden`}
			// ref={bodyRef}
			// style={{ height: open ? bodyRef.current?.scrollHeight : 0 }}
		>
			{children}
		</div>
	);
};

export default CategoryBody;
