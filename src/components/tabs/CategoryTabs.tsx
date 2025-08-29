"use client"

import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/api/category";
import { Category } from "@/api/category";

interface CategoryTabsProps {
    onCategoryChange?: (categoryId: number) => void;
    selectedCategoryId?: number;
}

const CategoryTabs = ({ onCategoryChange, selectedCategoryId }: CategoryTabsProps) => {
    const { data: categories = [], isLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
    });

    const handleCategoryChange = (categoryName: string) => {
        const category = categories.find(cat => cat.name === categoryName);
        if (category && onCategoryChange) {
            onCategoryChange(category.id);
        }
    };

    if (isLoading) {
        return (
            <div className="flex gap-[15px]">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div
                        key={i}
                        className="h-12 w-24 bg-gray-200 rounded-[25px] animate-pulse"
                    />
                ))}
            </div>
        );
    }

    return (
        <Tabs
            defaultValue={categories[0]?.name || "Hamma"}
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
        </Tabs>
    )
}

export default CategoryTabs