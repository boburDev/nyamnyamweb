"use client"

import { Container } from "@/components/container"
import FavouriteCart from "@/components/favourite/FavouriteCart"

export default function FavouritePage() {
    return (
    <Container className=" mt-[76px] pb-[45px]">
            <div className="mb-10">
                <h1 className="text-4xl font-medium text-textColor">Saqlangan mahsulotlar</h1>
            </div>
            <FavouriteCart />
        </Container>
    )
}