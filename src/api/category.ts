export interface Category {
    id: number;
    name: string;
    slug?: string;
}

export async function getCategories(): Promise<Category[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    return [
        {
            id: 1,
            name: "Hamma",
            slug: "all"
        },
        {
            id: 2,
            name: "Super box",
            slug: "super-box"
        },
        {
            id: 3,
            name: "Taomlar",
            slug: "meals"
        },
        {
            id: 4,
            name: "Fast food",
            slug: "fast-food"
        },
        {
            id: 5,
            name: "Shirinliklar",
            slug: "desserts"
        },
    ];
}
