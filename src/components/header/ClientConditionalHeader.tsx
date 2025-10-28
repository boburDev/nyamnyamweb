"use client";

import { usePathname } from "next/navigation";

interface ClientConditionalHeaderProps {
    children: (pathname: string) => React.ReactNode;
}

export const ClientConditionalHeader = ({ children }: ClientConditionalHeaderProps) => {
    const pathname = usePathname();
    return <>{children(pathname)}</>;
};

export default ClientConditionalHeader;
