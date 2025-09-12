"use client"

import type React from "react"

import Link from "next/link"
import toast, { type Toast } from "react-hot-toast"
import { X } from "lucide-react"
import { SuccesIcon } from "@/assets/icons"
import { WarningIcon } from "@/assets/icons"
import { InfoIcon } from "@/assets/icons"
import { ErrorIcon } from "@/assets/icons"
import type { ToastType } from "@/types"

interface ToastProps {
  title: string
  message?: string
  type: ToastType
  href?: string
  hrefName?: string
}

const toastStyles: Record<
  ToastType,
  {
    bgColor: string
    iconColor: string
    titleColor: string
    icon: React.ReactNode
  }
> = {
  success: {
    bgColor: "bg-white",
    iconColor: "text-mainColor",
    titleColor: "text-mainColor",
    icon: <SuccesIcon className="w-5 h-5" />,
  },
  warning: {
    bgColor: "bg-white",
    iconColor: "text-mainColor",
    titleColor: "text-[#F8B133]",
    icon: <WarningIcon className="w-5 h-5" />,
  },
  info: {
    bgColor: "bg-white",
    iconColor: "text-mainColor",
    titleColor: "text-[#237FD2]",
    icon: <InfoIcon className="w-5 h-5" />,
  },
  error: {
    bgColor: "bg-white",
    iconColor: "text-mainColor",
    titleColor: "text-[#E63946]",
    icon: <ErrorIcon className="w-5 h-5" />,
  },
}

export const showToast = ({ title, message, type, href, hrefName }: ToastProps) => {
  toast.custom(
    (t: Toast) => {
      const { bgColor, iconColor, titleColor, icon } = toastStyles[type]

      return (
        <div
          className={`
          ${bgColor} 
          backdrop-blur-sm
          rounded-xl 
          shadow-lg 
          p-4 
          min-w-[400px]
          mb-3 
          toast-enter
          transition-all 
          duration-300 
          hover:shadow-xl 
          hover:scale-[1.02]
          ${t.visible ? "animate-in slide-in-from-top-5" : "animate-out slide-out-to-top-5"}
        `}
        >
          <div className="flex items-start gap-3">
            <div className={`${iconColor} flex-shrink-0 mt-0.5`}>{icon}</div>

            <div className="flex-1 min-w-0">
              <h3 className={`${titleColor} font-medium text-lg leading-tight text-balance`}>{title}</h3>

              {message && <p className="text-card-foreground/80 text-sm mt-1 leading-relaxed text-pretty">{message}</p>}

              {href && hrefName && (
                <div className="mt-2 flex items-end justify-end">
                  <Link
                    href={href}
                    onClick={() => toast.remove(t.id)}
                    className={`${iconColor} text-sm font-medium hover:underline underline-offset-4 transition-colors`}
                  >
                    {hrefName}
                  </Link>
                </div>
              )}
            </div>

            <button
              className="flex-shrink-0 text-card-foreground/60 hover:text-card-foreground transition-colors p-1 rounded-md hover:bg-card-foreground/10"
              onClick={() => toast.remove(t.id)}
              aria-label="Close notification"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )
    },
    {
      duration: 5000,
      position: "top-center",
    },
  )
}

export const showSuccess = (title: string, message?: string, href?: string, hrefName?: string) =>
  showToast({ title, message, type: "success", href, hrefName })

export const showWarning = (title: string, message?: string) => showToast({ title, message, type: "warning" })

export const showInfo = (title: string, message?: string, href?: string, hrefName?: string) =>
  showToast({ title, message, type: "info", href, hrefName })

export const showError = (title: string, message?: string) => showToast({ title, message, type: "error" })
