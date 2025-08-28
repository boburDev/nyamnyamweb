import Link from "next/link";
import toast, { Toast } from "react-hot-toast";
import { Info, CheckCircle, AlertTriangle, X, Clock } from "lucide-react";
import { InfoIcon } from "@/assets/icons";
import WarningIcon from "@/assets/icons/WarningIcon";
import ErrorIcon from "@/assets/icons/ErrorIcon";
import SuccesIcon from "@/assets/icons/SuccesIcon";

type ToastType = "success" | "warning" | "info" | "error";

interface ToastProps {
    title: string;
    message?: string;
    type: ToastType;
    href?: string;
    hrefName?: string;
}

const toastStyles: Record<ToastType, {
    bg: string;
    text: string;
    icon: React.ReactNode;
    titleColor: string;
}> = {
    success: {
        bg: "#fff",
        text: "#4FB477",
        icon: <SuccesIcon />,
        titleColor: "#4FB477"
    },
    warning: {
        bg: "#fff",
        text: "#F8B133",
        icon: <WarningIcon />,
        titleColor: "#F8B133"
    },
    info: {
        bg: "#fff",
        text: "#237FD2",
        icon: <InfoIcon />,
        titleColor: "#237FD2"
    },
    error: {
        bg: "#fff",
        text: "#E63946",
        icon: <ErrorIcon />,
        titleColor: "#E63946"
    },
};

// const getIconBackground = (type: ToastType) => {
//     switch (type) {
//         case "success": return "bg-green-500";
//         case "warning": return "bg-orange-500";
//         case "info": return "bg-blue-500";
//         case "error": return "bg-red-500";
//         default: return "bg-blue-500";
//     }
// };

export const showToast = ({ title, message, type, href, hrefName }: ToastProps) => {
    toast.custom((t: Toast) => {
        const { bg, icon, titleColor } = toastStyles[type];
        // const iconBg = getIconBackground(type);

        return (
            <div
                className="max-w-[500px] w-full bg-white rounded-3xl shadow-lg border border-gray-100 p-4 mb-3"
                style={{ backgroundColor: bg }}
            >
                <div className="flex items-start gap-3">
                    {/* Icon */}


                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0`}>
                                        {icon}
                                    </div>
                                    <h3
                                        className="font-medium text-[20px]"
                                        style={{ color: titleColor }}
                                    >
                                        {title}
                                    </h3>
                                </div>
                                {message && (
                                    <p className="text-sm text-dolphin ml-8 mt-2 leading-relaxed">
                                        {message}
                                    </p>
                                )}
                                {href && hrefName && (
                                    <div className="mt-2">
                                        <Link
                                            href={href}
                                            onClick={() => toast.remove(t.id)}
                                            className="text-sm text-blue-600 underline hover:text-blue-800"
                                        >
                                            {hrefName}
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Close Button */}
                    <button
                        className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                        onClick={() => toast.remove(t.id)}
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        );
    });
};

// Convenience functions
export const showSuccess = (
    title: string,
    message?: string,
    href?: string,
    hrefName?: string
) => showToast({ title, message, type: "success", href, hrefName });

export const showWarning = (
    title: string,
    message?: string,
) => showToast({ title, message, type: "warning" });

export const showInfo = (
    title: string,
    message?: string,
    href?: string,
    hrefName?: string
) => showToast({ title, message, type: "info", href, hrefName });

export const showError = (
    title: string,
    message?: string,
) => showToast({ title, message, type: "error" });
