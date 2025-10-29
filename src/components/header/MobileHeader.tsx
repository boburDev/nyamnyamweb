"use client";

import { usePathname } from "next/navigation";
import { Container } from "../container";
import { LocationMenu, NotificationMenu } from "../menu";
import SearchMenu from "./SearchMenu";

export function MobileHeader({ isAuth }: { isAuth: boolean }) {
    const pathname = usePathname();

    const hiddenPaths = ["/profile", "/notification"];
    const isHiddenPage = hiddenPaths.some((path) => pathname.startsWith(path));

    if (isHiddenPage) return null;

    return (
        <header className="md:hidden">
            <Container>
                <div className="flex items-center justify-between">
                    <LocationMenu />
                    <NotificationMenu />
                </div>
                <SearchMenu auth={isAuth} />
            </Container>
        </header>
    );
}
