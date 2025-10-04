"use client"

// Removed unused Tabs components - now using custom buttons for multi-selection
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/api/category";
import { ReactNode, useState, useEffect, useRef } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import TabsLoader from "../loader/TabsLoader";

interface Category {
    id: number;
    name: string;
}

interface CategoryTabsProps {
    onCategoryChange?: (categoryIds: number[]) => void;
    selectedCategoryIds?: number[];
    children?: ReactNode;
}

const CategoryTabs = ({ onCategoryChange, selectedCategoryIds = [], children }: CategoryTabsProps) => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const isInitialized = useRef(false);

    const { data: categories = [], isLoading } = useQuery<Category[]>({
        queryKey: ["categories"],
        queryFn: getCategories,
    });

    // Get categories from URL query params
    const categoriesFromUrl = searchParams.get("categories");
    const [selectedIds, setSelectedIds] = useState<number[]>(() => {
        if (categoriesFromUrl) {
            return categoriesFromUrl.split(',').map(id => parseInt(id, 10)).filter(id => !isNaN(id));
        }
        return selectedCategoryIds.length > 0 ? selectedCategoryIds : [];
    });

    // Update selected categories when URL changes
    useEffect(() => {
        if (categoriesFromUrl) {
            const newSelectedIds = categoriesFromUrl.split(',').map(id => parseInt(id, 10)).filter(id => !isNaN(id));
            setSelectedIds(newSelectedIds);
        } else if (selectedCategoryIds.length > 0 && !isInitialized.current) {
            setSelectedIds(selectedCategoryIds);
            isInitialized.current = true;
        }
    }, [categoriesFromUrl, selectedCategoryIds, selectedIds]);

    // Notify parent only when selectedIds actually change (not on initial render)
    useEffect(() => {
        if (isInitialized.current && onCategoryChange) {
            onCategoryChange(selectedIds);
        }
    }, [selectedIds, onCategoryChange]);

    const handleCategoryChange = (categoryName: string) => {
        const category = categories.find((cat: Category) => cat.name === categoryName);
        if (category) {
            let newSelectedIds: number[];

            if (category.id === 1) {
                // "Hamma" - clear all selections, only "Hamma" is selected
                newSelectedIds = [1];
            } else {
                // Toggle category selection
                if (selectedIds.includes(category.id)) {
                    // Remove from selection
                    newSelectedIds = selectedIds.filter(id => id !== category.id);
                } else {
                    // Add to selection (but remove "Hamma" if it was selected)
                    newSelectedIds = [...selectedIds.filter(id => id !== 1), category.id];
                }
            }

            setSelectedIds(newSelectedIds);

            // Update URL with categories parameter
            const params = new URLSearchParams(searchParams.toString());
            if (newSelectedIds.length === 0 || (newSelectedIds.length === 1 && newSelectedIds[0] === 1)) {
                params.delete("categories"); // Remove categories param for "Hamma" or empty
            } else {
                params.set("categories", newSelectedIds.join(','));
            }
            window.history.pushState(null, "", `${pathname}?${params.toString()}`);

            if (onCategoryChange) {
                onCategoryChange(newSelectedIds);
            }
        }
    };

    if (isLoading) {
        return (
            <TabsLoader />
        );
    }

    return (
        <div>
            <div className="bg-transparent flex gap-[15px] mb-10">
                {categories?.map((category: Category) => {
                    const isSelected = selectedIds.includes(category.id);
                    return (
                        <button
                            key={category.id}
                            onClick={() => handleCategoryChange(category.name)}
                            className={`
                                px-[25px] py-[10.5px] rounded-[25px] leading-[100%] border h-12
                                font-medium transition-colors
                                ${isSelected
                                    ? '!bg-mainColor !text-white !border-mainColor font-semibold'
                                    : '!text-textColor bg-white !border-plasterColor hover:bg-gray-50'
                                }
                            `}
                        >
                            {category.name}
                        </button>
                    );
                })}
            </div>
            {children}
        </div>
    )
}

export default CategoryTabs

