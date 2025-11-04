"use client";

import { usePathname } from "next/navigation";
import { Container } from "../container";
import { LocationMenu, NotificationMenu } from "../menu";
import SearchMenu from "./SearchMenu";
import { LanguageMenuMobile } from "../menu/LanguageMenuMobile";

export function MobileHeader({ isAuth }: { isAuth: boolean }) {
    const pathname = usePathname();

    const segments = pathname.split("/").filter(Boolean);

    const surpriseBagIndex = segments.indexOf("surprise-bag");
    const isSurpriseBagDetail =
        surpriseBagIndex !== -1 && segments.length > surpriseBagIndex + 1;

    const isHiddenPage =
        segments.includes("profile") ||
        segments.includes("notification") ||
        segments.includes("cart") ||
        segments.includes("order") ||
        segments.includes("order-history") ||
        segments.includes("map") ||
        isSurpriseBagDetail; 

    if (isHiddenPage) return null;

    return (
        <header className="md:hidden">
            <Container>
                <div className="flex items-center justify-between">
                    <LocationMenu />
                    <div className="flex items-center gap-[7px]">
                        <LanguageMenuMobile />
                        <NotificationMenu />
                    </div>
                </div>
                <SearchMenu auth={isAuth} />
            </Container>
        </header>
    );
}
