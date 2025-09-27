import React from "react";

interface PageLoaderProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export const DataLoader: React.FC<PageLoaderProps> = ({
  message = "",
  size = "md"
}) => {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-12 w-12",
    lg: "h-16 w-16"
  };

  return (
    <div className="flex justify-center items-center h-64">
      <div className="flex flex-col items-center gap-4">
        <div className={`animate-spin rounded-full border-b-2 border-mainColor ${sizeClasses[size]}`}></div>
        <p className="text-dolphin text-sm">{message}</p>
      </div>
    </div>
  );
};

// Product skeleton loader component
export const ProductSkeleton: React.FC = () => (
  <div className="px-3">
    <div className="bg-white rounded-[25px] border border-gray-100 animate-pulse">
      <div className="relative">
        <div className="w-full h-[200px] skeleton-puls rounded-t-[25px]"></div>
        <div className="absolute top-3 right-3 w-8 h-8 skeleton-puls rounded-lg"></div>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-4 h-4 skeleton-puls rounded"></div>
          <div className="h-5 skeleton-puls rounded w-24"></div>
        </div>
        <div className="flex items-center gap-1 mb-3">
          <div className="h-4 skeleton-puls rounded w-20"></div>
          <div className="w-4 h-4 skeleton-puls rounded"></div>
          <div className="h-4 skeleton-puls rounded w-12"></div>
        </div>
        <div className="flex gap-[10px] justify-between">
          <div className="flex items-center gap-2 mt-3">
            <div className="h-5 skeleton-puls rounded w-20"></div>
            <div className="h-4 skeleton-puls rounded w-16"></div>
          </div>
          <div className="flex gap-2">
            <div className="w-10 h-10 skeleton-puls rounded-lg"></div>
            <div className="w-16 h-10 skeleton-puls rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Multiple product skeletons
export const ProductSkeletons: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <>
    {Array.from({ length: count }).map((_, index) => (
      <ProductSkeleton key={index} />
    ))}
  </>
);

// Responsive grid wrapper for product skeletons
export const ProductSkeletonGrid: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-3 md:gap-4 lg:gap-5 skeleton-animation">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>
          <div>
            <div className="relative ">
              <div className="w-full h-[200px] rounded-t-[25px] skeleton-puls"></div>
              <div className="absolute top-3 right-3 w-8 h-8  rounded-lg skeleton-puls"></div>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-5 skeleton-puls rounded w-26 skeleton-puls"></div>
              </div>
              <div className="flex items-center gap-1 mb-3">
                <div className="h-4 skeleton-puls rounded w-36 skeleton-puls"></div>
              </div>
              <div className="flex gap-[10px] justify-between">
                <div className="flex items-center gap-2 mt-3">
                  <div className="h-5 rounded w-20 skeleton-puls"></div>
                  <div className="h-4  rounded w-16 skeleton-puls"></div>
                </div>
                <div className="flex gap-2">
                  <div className="w-10 h-10  rounded-lg skeleton-puls"></div>
                  <div className="w-16 h-10  rounded-lg skeleton-puls"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Banner skeleton (full-width hero)
export const BannerSkeleton: React.FC = () => {
  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden">
      <div className="w-full h-full skeleton-puls " />
    </div>
  );
};

export default DataLoader;
