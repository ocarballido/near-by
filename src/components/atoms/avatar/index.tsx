'use client';

import { useGlobal } from '@/lib/context/GlobalContext';
import { useCallback } from 'react';

type AvatarProps = {
	onClick?: React.MouseEventHandler<HTMLDivElement>;
	className?: string;
};

const Avatar = ({ className, onClick }: AvatarProps) => {
	const { user } = useGlobal();

	const getInitials = useCallback((email: string) => {
		const parts = email.split('@')[0].split(/[._-]/);
		return parts.length > 1
			? (parts[0][0] + parts[1][0]).toUpperCase()
			: parts[0].slice(0, 1).toUpperCase();
	}, []);

	return (
		<div
			onClick={onClick}
			className={`w-10 h-10 rounded-full bg-primary-500 hover:bg-primary-600 hover:cursor-pointer flex justify-center items-center font-bold text-white text-xl transition-all duration-200 focus:border-4 focus:border-primary-200 ${className}`}
		>
			{user ? getInitials(user.email) : '?'}
		</div>
	);
};

export default Avatar;
