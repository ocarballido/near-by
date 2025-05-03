import { SidebarProvider } from '@/lib/context/SidebarContext';
import Sidebar from '@/components/organisms/sidebar';
import Content from '@/components/organisms/content';
import AppBar from '@/components/organisms/appbar';

export default function PropertyLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="p-4 flex flex-col gap-2 items-stretch w-full min-h-screen bg-gray-100 font-body overflow-hidden">
			<AppBar isLogged />
			<SidebarProvider>
				<div className="flex flex-col gap-2 items-stretch w-full bg-gray-100 font-body overflow-hidden grow">
					<div
						className={`flex flex-auto gap-4 md:gap-4 min-h-full relative w-full`}
					>
						<Sidebar />
						<Content>{children}</Content>
					</div>
				</div>
			</SidebarProvider>
		</div>
	);
}
