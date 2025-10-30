import { LogoIcon } from "@/assets/icons";
import { authImage } from "@/assets/images";
import { Link } from "@/i18n/navigation";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:block overflow-hidden h-dvh relative">
        <div className="absolute top-4 left-4 z-10">
          <Link href="/" >
            <LogoIcon className="h-10 xl:h-auto" />
          </Link>
        </div>
        <Image
          src={authImage}
          alt="Auth layout image"
          fill
          className="h-full w-full object-cover"
          priority
        />
      </div>
      <div className="flex flex-col justify-center px-5 sm:px-10 lg:px-20 3xl:px-[182px] h-dvh overflow-y-auto py-5 sm:w-134 lg:w-full sm:mx-auto lg:mx-0">
        {children}
      </div>
    </div>
  );
}
