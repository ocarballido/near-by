export default function ModalLayout({ children }: React.PropsWithChildren) {
	return (
		<div className="p-4 font-roboto flex flex-col grow gap-4 bg-white rounded-lg overflow-hidden justify-center items-center">
			{children}
		</div>
	);
}
