import { AuthSyncAfterOAuth } from "@/components/auth-sync-oauth/AuthSyncAfterOAuth";
import LogoLoader from "@/components/loader/LogoLoader";

export default function CallbackPage() {
  return (
    <div className="flex justify-center items-center h-screen">
      <LogoLoader />
      <AuthSyncAfterOAuth />
    </div>
  );
}
