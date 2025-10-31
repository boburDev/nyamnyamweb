"use client";

import { usePathname } from "next/navigation";
import { Container } from "../container";
import { LocationMenu, NotificationMenu } from "../menu";
import SearchMenu from "./SearchMenu";

export function MobileHeader({ isAuth }: { isAuth: boolean }) {
    const pathname = usePathname();

    // Hide header on pages where the URL contains these segments (locale-safe)
    const segments = pathname.split("/").filter(Boolean);
    const isHiddenPage = segments.includes("profile") || segments.includes("notification");

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
