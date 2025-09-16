import { NextResponse } from "next/server";
import { notificationData } from "@/data/notification-data";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (id) {
            // ID bo'yicha bitta notification qaytarish
            const notification = notificationData.find(item => item.id === parseInt(id));

            if (!notification) {
                return NextResponse.json(
                    { success: false, message: "Notification topilmadi" },
                    { status: 404 }
                );
            }

            return NextResponse.json(
                { success: true, notification },
                { status: 200 }
            );
        } else {
            // Barcha notificationlarni qaytarish
            return NextResponse.json(
                { success: true, notifications: notificationData },
                { status: 200 }
            );
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
