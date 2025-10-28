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
        <header className="block sm:hidden">
            <div className="px-4 py-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {showBackButton && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleBackClick}
                                className="p-2 hover:bg-gray-100"
                            >
                                <ArrowBackIcon className="w-5 h-5" />
                            </Button>
                        )}
                        <h1 className="text-lg font-semibold text-gray-900">
                            {title}
                        </h1>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default PageHeader;
