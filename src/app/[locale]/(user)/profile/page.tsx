import { dehydrate, QueryClient } from "@tanstack/react-query";
import { getUsers } from "@/api";
import { ProfilePageClient } from "@/components/profile";
import PageHeader from "@/components/header/PageHeader";
import Providers from "@/components/provider/Provider";
import ProfilePageServer from "@/components/profile/ProfilePageServer";
import { getAuthStatus } from "@/lib/auth";
import { getTranslations } from "next-intl/server";
export default async function ProfilePage() {
  const t = await getTranslations("profile");
  const queryClient = new QueryClient();
  const isAuth = await getAuthStatus();
  if (isAuth) {
    await queryClient.prefetchQuery({
      queryKey: ["user"],
      queryFn: getUsers,
    });
  }

  return (
    <>

      {isAuth ? (
        <Providers dehydratedState={dehydrate(queryClient)}>
          <PageHeader title={t("title")} />
          <ProfilePageClient />
        </Providers>
      ) : (
        <ProfilePageServer />
      )}
    </>
  );
}
