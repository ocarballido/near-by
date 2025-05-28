import { GlobalProvider } from '@/lib/context/GlobalContext';
import { AIUsageProvider } from '@/lib/context/AIUsageContext';
import AppLayout from '@/components/layouts/app';
import { getSidebarData } from '@/utils/get-sidebar-data';
import { EditMenuProvider } from '@/lib/context/EditMenuContext';

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const categories = await getSidebarData();
	return (
		<GlobalProvider>
			<AIUsageProvider>
				<AppLayout>
					<EditMenuProvider initialData={categories}>
						{children}
					</EditMenuProvider>
				</AppLayout>
			</AIUsageProvider>
		</GlobalProvider>
	);
}
