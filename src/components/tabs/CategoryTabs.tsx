"use client"

import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/api/category";
import { ReactNode, useState, useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import TabsLoader from "../loader/TabsLoader";

interface CategoryTabsProps {
    onCategoryChange?: (categoryId: number) => void;
    selectedCategoryId?: number;
    children?: ReactNode;
}

const CategoryTabs = ({ onCategoryChange, selectedCategoryId, children }: CategoryTabsProps) => {
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const { data: categories = [], isLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
    });

    // Get category from URL query params
    const categoryIdFromUrl = searchParams.get("category");
    const [activeCategoryId, setActiveCategoryId] = useState<number | undefined>(
        categoryIdFromUrl ? parseInt(categoryIdFromUrl, 10) : selectedCategoryId
    );

    // Update active category when URL changes
    useEffect(() => {
        if (categoryIdFromUrl) {
            const categoryId = parseInt(categoryIdFromUrl, 10);
            if (!isNaN(categoryId)) {
                setActiveCategoryId(categoryId);
                if (onCategoryChange) {
                    onCategoryChange(categoryId);
                }
            }
        } else if (selectedCategoryId !== undefined) {
            setActiveCategoryId(selectedCategoryId);
        }
    }, [categoryIdFromUrl, selectedCategoryId, onCategoryChange]);

    const handleCategoryChange = (categoryName: string) => {
        const category = categories.find(cat => cat.name === categoryName);
        if (category) {
            setActiveCategoryId(category.id);

            // Update URL with category parameter
            const params = new URLSearchParams(searchParams.toString());
            if (category.id === 1) {
                params.delete("category"); // Remove category param for "Hamma"
            } else {
                params.set("category", category.id.toString());
            }
            window.history.pushState(null, "", `${pathname}?${params.toString()}`);

            if (onCategoryChange) {
                onCategoryChange(category.id);
            }
        }
    };

    if (isLoading) {
        return (
          <TabsLoader />
        );
    }

    // Determine which category should be active based on activeCategoryId
    const getActiveCategoryName = () => {
        if (activeCategoryId) {
            const category = categories.find(cat => cat.id === activeCategoryId);
            return category ? category.name : categories[0]?.name || "Hamma";
        }
        return categories[0]?.name || "Hamma";
    };

    return (
        <Tabs
            value={getActiveCategoryName()}
            onValueChange={handleCategoryChange}
        >
            <TabsList className="bg-transparent flex gap-[15px] mb-10">
                {categories.map((category) => (
                    <TabsTrigger
                        key={category.id}
                        value={category.name}
                        className="data-[state=active]:!bg-mainColor data-[state=active]:!text-white !text-textColor font-medium data-[state=active]:font-semibold px-[25px] py-[10.5px] rounded-[25px] leading-[100%] bg-white border !border-plasterColor data-[state=active]:!border-mainColor h-12"
                    >
                        {category.name}
                    </TabsTrigger>
                ))}
            </TabsList>
            {children}
        </Tabs>
    )
}

export default CategoryTabs
