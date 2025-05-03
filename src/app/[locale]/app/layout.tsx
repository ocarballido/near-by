import { GlobalProvider } from '@/lib/context/GlobalContext';
import AppLayout from '@/components/layouts/app';

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<GlobalProvider>
			<AppLayout>{children}</AppLayout>
		</GlobalProvider>
	);
}
