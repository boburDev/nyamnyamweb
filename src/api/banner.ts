export interface Banner {
    id: number;
    image: string;
    title?: string;
    description?: string;
    link?: string;
}

export async function getBanners(): Promise<Banner[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    return [
        {
            id: 1,
            image: "/swipe1.png",
        },
        {
            id: 2,
            image: "/swipe3.png",
        },
    ];
}
