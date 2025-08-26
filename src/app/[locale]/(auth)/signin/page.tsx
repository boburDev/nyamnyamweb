"use client";

import { Button } from "@/components/ui/button";
import useStore from "@/context/store";
import { useRouter } from "@/i18n/navigation";

const SigninPage = () => {
  const login = useStore((s) => s.login);
  const router = useRouter();
  const handleLogin = () => {
    login("asdhkashdiqwghjasgdkjahgd1u24186tasdkjasj");
    router.push("/");
  };
  return (
    <div>
      <Button onClick={handleLogin}>Login</Button>
    </div>
  );
};

export default SigninPage;
