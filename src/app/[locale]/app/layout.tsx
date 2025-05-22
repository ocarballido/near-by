import { GlobalProvider } from '@/lib/context/GlobalContext';
import { AIUsageProvider } from '@/lib/context/AIUsageContext';
import AppLayout from '@/components/layouts/app';

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<GlobalProvider>
			<AIUsageProvider>
				<AppLayout>{children}</AppLayout>
			</AIUsageProvider>
		</GlobalProvider>
	);
}
