import { useState, useCallback, useRef, useEffect } from 'react';

export function useDropdown() {
	const [open, setOpen] = useState<boolean>(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const toggleDropdown = useCallback(() => {
		setOpen((prev) => !prev);
	}, []);

	const closeDropdown = () => {
		setOpen(false);
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				closeDropdown();
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	useEffect(() => {
		const handleResize = () => {
			closeDropdown();
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return {
		open,
		toggleDropdown,
		closeDropdown,
		dropdownRef,
	};
}
