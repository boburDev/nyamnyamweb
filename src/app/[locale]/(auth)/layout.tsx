import { authImage } from "@/assets/images";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-2">
      <div className="overflow-hidden h-screen">
        <Image
          src={authImage}
          alt="auth"
          width={955}
          height={1084}
          className="h-full w-full object-cover"
          priority  
        />
      </div>
      <div className="flex items-center px-[182px]">{children}</div>
    </div>
  );
}
