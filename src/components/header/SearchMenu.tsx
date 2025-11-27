"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Map, X, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useQuery } from "@tanstack/react-query";
import { surpriseSearch } from "@/api";
import { ProductData } from "@/types";
import { useTranslations } from "next-intl";

type ProductDataMap = {
  [key: string]: ProductData[];
};

function debounce<T extends (...args: string[]) => void>(func: T, delay: number) {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

const SearchMenu = ({ auth, className }: { auth?: boolean, className?: string }) => {
  const t = useTranslations("Navbar.search");
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isTyping, setIsTyping] = useState(false);

  const debouncedSetSearch = useRef(
    debounce((val: string) => {
      setSearch(val);
      setIsTyping(false);
    }, 500) // 500ms delay — ideal
  ).current;

  const { data: productDataMap = {}, isLoading } = useQuery<ProductDataMap>({
    queryKey: ["surprise-search", search],
    queryFn: () => surpriseSearch(search),
    enabled: !!search,
  });

  const allProducts: ProductData[] = Object.values(productDataMap).flat();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setIsTyping(true);
    debouncedSetSearch(val);
    if (val.length > 0) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };


  const handleItemClick = (title: string) => {
    setSearch(title);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleNavigationClick = () => {
    setIsOpen(false);
  };
  const handleClearInput = () => {
    if (inputRef.current) {
      inputRef.current.value = ""; // inputni tozalash
      inputRef.current.focus();
    }
    setSearch("");
    setIsOpen(false);
    setIsTyping(false);
  };
  return (
    <div
      className={`relative w-full ${auth ? "mt-[18px] md:mt-0 md:ml-3 xl:ml-20 2xl:ml-[130px]" : "mt-[18px] md:mt-0 lg:ml-[30px]"} ${className}`}
      ref={dropdownRef}
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          ref={inputRef}
          onChange={handleInputChange}
          onFocus={() => {
            if (search.length > 0) setIsOpen(true);
          }}
          className="border-none bg-white shadow-none h-12 rounded-[15px] placeholder:text-base placeholder:font-medium py-2 pl-10 pr-12 text-[15px] w-full text-textColor focus:outline-none"
          placeholder={`${t("placeholder")}...`}
        />
        {search && (
          <span
            onClick={handleClearInput}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
          >
            <X className="text-mainColor w-5 h-5" />
          </span>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-lg rounded-[15px] border border-gray-100 z-50 overflow-y-auto max-h-[70vh]">
          <div className="p-4">
            {isLoading || isTyping ? (
              <p className="text-center text-dolphin">{t("loading")}</p>
            ) : allProducts.length > 0 ? (
              <>
                <Link
                  href={`/map`}
                  className="flex justify-between items-center py-[6px] px-[10px] rounded-[7px] bg-mainColor/5 mb-3"
                  onClick={handleNavigationClick}
                >
                  <div className="flex items-center gap-2">
                    <div className="p-[6px] bg-white rounded-[7px]">
                      <Map className="w-5 h-5 text-mainColor" />
                    </div>
                    <h3 className="font-medium text-textColor">
                      {t("view-all")}
                    </h3>
                  </div>
                  <ChevronRight className="w-5 h-5 text-mainColor" />
                </Link>

                <h3 className="text-xs font-medium text-dolphin my-4">
                  {t("found")}
                </h3>
                <div className="space-y-2">
                  {allProducts.map((item, idx) => (
                    <Link
                      href={`/surprise-bag/${item.id}`}
                      key={item.id + "-" + idx}
                      className="flex items-center gap-[10px] px-[10px] py-[6px] rounded-lg cursor-pointer hover:bg-mainColor/5 transition-colors"
                      onClick={() => {
                        handleItemClick(item.title);
                        handleNavigationClick();
                      }}
                    >
                      {item.cover_image ? (
                        <Image
                          src={item.cover_image}
                          alt={item.title || t("product-image")}
                          width={40}
                          height={40}
                          className="object-cover rounded-lg w-10 h-10"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                      )}
                      <div className="flex-1">
                        <div className="font-semibold text-sm text-textColor">
                          {item.title}
                        </div>
                        <div className="text-[10px] text-dolphin">
                          {item.business_name}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-center text-dolphin">{t("not-found")}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchMenu;
