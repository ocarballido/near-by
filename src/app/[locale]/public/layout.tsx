import { GlobalProvider } from '@/lib/context/GlobalContext';
import PublicLayout from '@/components/layouts/public';

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<GlobalProvider>
			<PublicLayout>{children}</PublicLayout>
		</GlobalProvider>
	);
}
