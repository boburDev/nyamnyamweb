"use client";

import { Link } from "@/i18n/navigation";
import { Container } from "../container";
import SearchMenu from "./SearchMenu";
import { LocationMenu, NotificationMenu, LanguageMenu } from "../menu";
import { Button } from "../ui/button";
import { CartIcon, UserIcon } from "@/assets/icons";
import useCartStore from "@/context/cartStore";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCart } from "@/api";

interface MobileHeaderProps {
    auth: boolean;
}

export const MobileHeader = ({ auth }: MobileHeaderProps) => {
    const guestCount = useCartStore((s) => s.items.length);
    const [isClient, setIsClient] = useState(false);
    const { data } = useQuery({
        queryKey: ["cart"],
        queryFn: getCart,
        enabled: auth,
        refetchOnWindowFocus: false,
    });

    const serverCount = (data?.cart_items?.length as number) || 0;
    const serverTotal = (data?.cart_total as number) || 0;

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <header className="block sm:hidden">
            <Container className="px-4 py-3">
                {/* Top row with location and notification */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <LocationMenu />
                    </div>
                    <div className="flex items-center gap-2">
                        {auth && <NotificationMenu />}
                        <LanguageMenu />
                    </div>
                </div>

                {/* Search input */}
                <div className="mb-3">
                    <SearchMenu auth={auth} />
                </div>

                {/* Bottom row with cart and user actions */}
                <div className="flex items-center justify-between">
                    {auth ? (
                        <div className="flex items-center gap-3">
                            <Button asChild className="flex-1 relative">
                                <Link href="/cart">
                                    <div className="flex items-center gap-2 py-2">
                                        <CartIcon />
                                        <span className="text-sm">
                                            {isClient ? serverTotal.toLocaleString() : "0"} UZS
                                        </span>
                                    </div>
                                    {isClient && serverCount > 0 && (
                                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                                            {serverCount}
                                        </div>
                                    )}
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 w-full">
                            <Button
                                asChild
                                className="flex-1 relative"
                            >
                                <Link href="/cart">
                                    <div className="flex items-center gap-2 py-2">
                                        <CartIcon />
                                        <span className="text-sm">Savat</span>
                                    </div>
                                    {isClient && guestCount > 0 && (
                                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                                            {guestCount}
                                        </div>
                                    )}
                                </Link>
                            </Button>
                            <Link href={"/signin"} className="flex">
                                <Button className="px-4 py-2">
                                    <UserIcon />
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </Container>
        </header>
    );
};

export default MobileHeader;
