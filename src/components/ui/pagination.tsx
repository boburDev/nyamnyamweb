import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "./button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({ currentPage, totalPages, onPageChange, className = "" }: PaginationProps) {
  const getVisiblePages = () => {
    const pages: (number | string)[] = []

    if (totalPages <= 7) {
      // Show all pages if total is 7 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (currentPage <= 4) {
        // Show pages 2, 3, 4, 5, ..., last
        for (let i = 2; i <= 5; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 3) {
        // Show first, ..., last-4, last-3, last-2, last-1, last
        pages.push("...")
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        // Show first, ..., current-1, current, current+1, ..., last
        pages.push("...")
        pages.push(currentPage - 1)
        pages.push(currentPage)
        pages.push(currentPage + 1)
        pages.push("...")
        pages.push(totalPages)
      }
    }

    return pages
  }

  const visiblePages = getVisiblePages()

  return (
    <div className={`flex items-center justify-center gap-1 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-8 w-8 p-0 rounded-lg border-gray-200 hover:bg-gray-50"
      >
        <ChevronLeft className="h-4 w-4 text-gray-600" />
      </Button>

      {visiblePages.map((page, index) => (
        <div key={index}>
          {page === "..." ? (
            <Button
              variant="outline"
              size="sm"
              disabled
              className="h-8 w-8 p-0 rounded-lg border-gray-200 bg-white text-gray-600"
            >
              ...
            </Button>
          ) : (
            <Button
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page as number)}
              className={`h-8 w-8 p-0 rounded-lg ${currentPage === page
                ? "bg-[#F3FAF5] !text-mainColor border border-mainColor hover:!text-white"
                : " bg-white text-textColor "
                }`}
            >
              {page}
            </Button>
          )}
        </div>
      ))}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-8 w-8 p-0 rounded-lg "
      >
        <ChevronRight className="h-4 w-4 text-gray-600" />
      </Button>
    </div>
  )
}
