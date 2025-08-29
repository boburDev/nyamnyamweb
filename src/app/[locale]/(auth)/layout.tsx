import { authImage } from "@/assets/images";
import { Link } from "@/i18n/navigation";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-2">
      <div className="overflow-hidden h-screen relative">
        <div className="absolute top-4 left-4 w-full h-full z-10">
          <Link href="/" className="font-medium text-white text-[40px]">
          Logo
          </Link>
        </div>
        <Image
          src={authImage}
          alt="auth"
          width={955}
          height={1084}
          className="h-full w-full object-cover"
          priority  
        />
      </div>
      <div className="flex items-center px-20 2xl:px-[182px]">{children}</div>
    </div>
  );
}
