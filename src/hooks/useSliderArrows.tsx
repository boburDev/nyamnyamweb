import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const useSliderArrows = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [windowWidth, setWindowWidth] = useState(0);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const NextArrow = ({
        onClick,
        currentSlide: cs,
        total,
    }: {
        onClick: () => void;
        currentSlide: number;
        total: number;
    }) => {
        const shouldHideArrow = () => {
            if (windowWidth <= 768) return total <= 1;
            if (windowWidth <= 1024) return total <= 2;
            return total <= 3;
        };
        if (shouldHideArrow()) return null;

        const getMaxSlide = () => {
            if (windowWidth <= 768) return total - 1;
            if (windowWidth <= 1024) return total - 2;
            return total - 3;
        };
        const isDisabled = cs >= getMaxSlide();

        return (
            <button
                onClick={onClick}
                disabled={isDisabled}
                className={`absolute right-[-10px] top-1/2 -translate-y-1/2 z-50 p-2 rounded-full transition
          ${isDisabled
                        ? "bg-white border border-mainColor cursor-not-allowed"
                        : "bg-mainColor hover:bg-green-600"
                    }`}
            >
                <ChevronRight
                    className={`w-6 h-6 ${isDisabled ? "text-mainColor" : "text-white"}`}
                />
            </button>
        );
    };

    const PrevArrow = ({
        onClick,
        currentSlide: cs,
        total,
    }: {
        onClick: () => void;
        currentSlide: number;
        total: number;
    }) => {
        const shouldHideArrow = () => {
            if (windowWidth <= 768) return total <= 1;
            if (windowWidth <= 1024) return total <= 2;
            return total <= 3;
        };
        if (shouldHideArrow()) return null;

        const isDisabled = cs === 0;
        return (
            <button
                onClick={onClick}
                disabled={isDisabled}
                className={`absolute left-[-10px] top-1/2 -translate-y-1/2 z-50 p-2 rounded-full transition
          ${isDisabled
                        ? "bg-white border border-mainColor cursor-not-allowed"
                        : "bg-mainColor hover:bg-green-600"
                    }`}
            >
                <ChevronLeft
                    className={`w-6 h-6 ${isDisabled ? "text-mainColor" : "text-white"}`}
                />
            </button>
        );
    };

    return {
        currentSlide,
        setCurrentSlide,
        NextArrow,
        PrevArrow,
    };
};