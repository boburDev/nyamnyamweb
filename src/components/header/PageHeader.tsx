"use client";

import { useRouter } from "@/i18n/navigation";
import { ArrowBackIcon } from "@/assets/icons";
import { Button } from "../ui/button";

interface PageHeaderProps {
    title: string;
    showBackButton?: boolean;
    onBackClick?: () => void;
}

export const PageHeader = ({
    title,
    showBackButton = true,
    onBackClick
}: PageHeaderProps) => {
    const router = useRouter();

    const handleBackClick = () => {
        if (onBackClick) {
            onBackClick();
        } else {
            router.back();
        }
    };

    return (
        <header className="block md:hidden">
            <div className="px-4 py-3">
                <div className="flex items-center w-full">
                    <div className="flex items-center w-full mb-[14px] 3xl:mb-10 relative">
                        {showBackButton && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleBackClick}
                                className="p-2 hover:bg-gray-100 relative z-10"
                            >
                                <ArrowBackIcon className="size-6" />
                            </Button>
                        )}
                        <h1 className="font-medium w-full text-center md:text-left text-[20px] md:text-[28px] 3xl:text-[36px] text-textColor absolute z-9 left-1/2 -translate-x-1/2">
                            {title}
                        </h1>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default PageHeader;
