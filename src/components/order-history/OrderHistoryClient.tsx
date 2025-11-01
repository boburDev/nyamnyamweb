"use client";
import { Container } from "@/components/container";
import { EmptyOrderHistory } from "@/components/order";
import { useGetOrderHistory } from "@/hooks";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays, Clock, Star } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface OrderItem {
    status: string;
    title: string;
    price: number;
    original_price: number;
    count: number;
    business_branch_name: string;
    overall_rating: number | null;
    surprise_bag_img: string;
    start_time: string;
    pickup_date: string;
}

interface Order {
    id: string;
    order_number: string;
    order_items: OrderItem[];
}

interface FilteredOrderItem extends OrderItem {
    order_number: string;
}

export function OrderHistoryClient() {
    const locale = useLocale();
    const t = useTranslations("orders-history");
    const { data: orders } = useGetOrderHistory(locale);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("uz-UZ").format(price) + " UZS";
    };

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return format(date, "yyyy.MM.dd");
        } catch {
            return dateString;
        }
    };

    const formatTime = (timeString: string) => {
        try {
            const [hours, minutes] = timeString.split(":");
            return `${hours}:${minutes}`;
        } catch {
            return timeString;
        }
    };

    const getStatusText = (status: string) => {
        if (status.toLowerCase().includes("picked") || status.toLowerCase().includes("olib")) {
            return t("cards.confirm-button");
        }
        if (status.toLowerCase().includes("cancel")) {
            return t("cards.canceled-button");
        }
        return status;
    };

    const filteredOrders: FilteredOrderItem[] = (orders
        ?.flatMap((order: Order) =>
            order.order_items.map((item) => ({ ...item, order_number: order.order_number }))
        )
        .filter((item: FilteredOrderItem) => {
            if (statusFilter !== "all") {
                const statusLower = item.status.toLowerCase();
                if (statusFilter === "picked") {
                    if (!statusLower.includes("picked") && !statusLower.includes("olib")) {
                        return false;
                    }
                } else if (statusFilter === "canceled") {
                    if (!statusLower.includes("cancel")) {
                        return false;
                    }
                }
            }
            if (dateFilter && item.pickup_date) {
                const itemDate = new Date(item.pickup_date);
                const filterDate = new Date(dateFilter);
                if (
                    itemDate.getFullYear() !== filterDate.getFullYear() ||
                    itemDate.getMonth() !== filterDate.getMonth() ||
                    itemDate.getDate() !== filterDate.getDate()
                ) {
                    return false;
                }
            }
            return true;
        }) || []) as FilteredOrderItem[];

    return (
        <Container>
            <div className="pt-[150px] pb-10">
                <h1 className="font-medium text-4xl mb-6">{t("title")}</h1>

                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-textColor font-medium">{t("select.title")}</label>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="bg-gray-50 border-gray-200 rounded-lg h-12 w-full sm:w-[200px]">
                                <SelectValue placeholder={t("select.placeholder")}>
                                    {statusFilter === "all"
                                        ? t("select.element-1")
                                        : statusFilter === "picked"
                                            ? t("select.element-2")
                                            : t("select.element-3")}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t("select.element-1")}</SelectItem>
                                <SelectItem value="picked">{t("select.element-2")}</SelectItem>
                                <SelectItem value="canceled">{t("select.element-3")}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-textColor font-medium">{t("date.title")}</label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "bg-gray-50 border-gray-200 rounded-lg h-12 w-full sm:w-[200px] justify-start text-left font-normal",
                                        !dateFilter && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarDays className="mr-2 h-4 w-4" />
                                    {dateFilter ? format(dateFilter, "yyyy.MM.dd") : t("date.placeholder")}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={dateFilter}
                                    onSelect={setDateFilter}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                {filteredOrders.length > 0 ? (
                    <div className="space-y-4">
                        {filteredOrders.map((item: FilteredOrderItem, index: number) => (
                            <div
                                key={`${item.order_number}-${index}`}
                                className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row gap-6"
                            >
                                <div className="flex-shrink-0">
                                    <Image
                                        src={item.surprise_bag_img}
                                        alt={item.title}
                                        width={150}
                                        height={150}
                                        className="rounded-xl object-cover w-[150px] h-[150px] flex-shrink-0"
                                    />
                                </div>

                                <div className="flex-grow flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-semibold text-lg text-textColor mb-2">
                                            {item.title}
                                        </h3>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                            <span className="text-textColor font-medium">
                                                {item.overall_rating !== null && item.overall_rating !== undefined
                                                    ? item.overall_rating.toFixed(1)
                                                    : "0.0"}
                                            </span>
                                            <span className="text-dolphin text-sm">
                                                • {item.business_branch_name}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="font-bold text-green-600 text-lg">
                                                {formatPrice(item.price)}
                                            </span>
                                            {item.original_price > item.price && (
                                                <span className="text-dolphin line-through text-sm font-normal">
                                                    {new Intl.NumberFormat("uz-UZ").format(item.original_price)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end justify-between gap-4 min-w-[140px]">
                                    <div className="flex flex-col items-end gap-1">
                                        {item.pickup_date && (
                                            <div className="flex items-center gap-1.5 text-dolphin text-sm">
                                                <CalendarDays className="h-4 w-4" />
                                                {formatDate(item.pickup_date)}
                                            </div>
                                        )}
                                        {item.start_time && (
                                            <div className="flex items-center gap-1.5 text-dolphin text-sm">
                                                <Clock className="h-4 w-4" />
                                                {formatTime(item.start_time)}
                                            </div>
                                        )}
                                    </div>

                                    <div
                                        className={cn(
                                            "px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap",
                                            item.status.toLowerCase().includes("cancel")
                                                ? "bg-red-50 text-red-600"
                                                : "bg-green-50 text-green-600"
                                        )}
                                    >
                                        {getStatusText(item.status)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyOrderHistory />
                )}
            </div>
        </Container>
    );
}

