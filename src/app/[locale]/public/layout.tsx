import PublicLayout from "@/components/layouts/public";
import { createSSRClient } from "@/lib/supabase/server";

export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const ssrClient = await createSSRClient();
    const {
        data: { user },
    } = await ssrClient.auth.getUser();

    const isLoggedIn = Boolean(user);

    return <PublicLayout isLoggedIn={isLoggedIn}>{children}</PublicLayout>;
}
