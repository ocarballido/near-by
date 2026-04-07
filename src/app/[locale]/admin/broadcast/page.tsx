import { redirect } from 'next/navigation';
import { createSSRClient } from '@/lib/supabase/server';
import BroadcastForm from './BroadcastForm';

export default async function BroadcastPage() {
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

	return <BroadcastForm />;
}
