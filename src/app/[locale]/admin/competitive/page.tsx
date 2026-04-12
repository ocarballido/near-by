import { redirect } from 'next/navigation';
import { createSSRClient } from '@/lib/supabase/server';
import CompetitiveAgent from './CompetitiveAgent';

export default async function CompetitivePage() {
	const ssrClient = await createSSRClient();
	const {
		data: { user },
		error,
	} = await ssrClient.auth.getUser();

	if (error || !user) redirect('/auth/login');

	const adminEmails = (process.env.ADMIN_EMAILS ?? '')
		.split(',')
		.map((e) => e.trim())
		.filter(Boolean);

	if (!adminEmails.includes(user.email ?? '')) redirect('/');

	return <CompetitiveAgent />;
}
