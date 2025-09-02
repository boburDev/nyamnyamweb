"use client";
import { useState, useEffect, useRef } from "react";
import { Search, Map, X, ChevronRight } from "lucide-react";
import MyImage from "../../assets/images/Frame.png";
import { Link } from "@/i18n/navigation";

const foundProducts = [
  {
    id: 1,
    name: "Suprise box",
    location: 'Oqtepa lavash',
    image: MyImage,
    selected: true
  },
  {
    id: 2,
    name: "Suprise box",
    location: 'Oqtepa lavash',
    image: MyImage,
    selected: false
  },
  {
    id: 3,
    name: "Suprise box",
    location: 'Oqtepa lavash',
    image: MyImage,
    selected: false
  },
]

const popularSearches = [
  {
    id: 1,
    name: "Super box",
  },
  {
    id: 2,
    name: "Suprise bag",
  },
  {
    id: 3,
    name: "Morning suprise",
  },
]

const SearchMenu = ({ auth }: { auth: boolean }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const filteredProducts = foundProducts.filter(product =>
    product.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    product.location.toLowerCase().includes(searchValue.toLowerCase())
  )

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchValue(value)
    if (value.length > 0) {
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }

  const handleInputFocus = () => {
    if (searchValue.length > 0) {
      setIsOpen(true)
    }
  }

  const handleItemClick = (itemName: string) => {
    setSearchValue(itemName)
    setIsOpen(false)
    inputRef.current?.focus()
  }

  return (
    <div className={`relative w-full ${auth ? "ml-[130px]" : "ml-[58px]"}`} ref={dropdownRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          ref={inputRef}
          value={searchValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className="border-none bg-white shadow-none h-12 rounded-[15px] py-2 pl-10 pr-12 text-[15px] w-full text-textColor focus:outline-none"
          placeholder="Search..."
        />
        {
          searchValue && (
            <X onClick={() => { setSearchValue(""); setIsOpen(false) }} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-mainColor w-5 h-5" />
          )
        }
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-lg rounded-[15px] border border-gray-100 z-50  overflow-y-auto">
          <div className="p-4">
            {searchValue && (
              <div>
                <Link href={`/map`} className="flex justify-between items-center py-[6px] px-[10px] rounded-[7px] bg-mainColor/5">
                  <div className="flex items-center gap-2">
                    <div className="p-[6px] bg-white rounded-[7px]">
                      <Map className="w-5 h-5 text-mainColor" />
                    </div>
                    <h3 className=" font-medium text-textColor">Hamma mahsulotlarni ko'rish</h3>
                  </div>
                  <ChevronRight className="w-5 h-5 text-mainColor" />
                </Link>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-medium text-dolphin my-5">Topilgan mahsulotlar</h3>
                    <div className="space-y-2">
                      {filteredProducts.map((item) => (
                        <Link href={`/`}
                          key={item.id}
                          className={`flex items-center gap-[10px] px-[10px] py-[6px] rounded-lg cursor-pointer transition-colors ${item.selected ? 'bg-mainColor/5' : 'hover:bg-mainColor/5'
                            }`}
                          onClick={() => handleItemClick(item.name)}
                        >
                          <img src={item.image.src} alt={item.name} className="w-[36px] h-[36px] object-cover rounded-lg" />
                          <div className="flex-1">
                            <div className="font-semibold text-sm text-textColor">{item.name}</div>
                            <div className="text-[10px] text-dolphin">{item.location}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-dolphin my-5">Ommabop qidiruvlar</h3>
                  <div className="grid grid-cols-1 gap-[10px]">
                    {popularSearches.map((item) => (
                      <Link href={`/`}
                        key={item.id}
                        className="px-[10px] py-[9.5px] rounded-lg cursor-pointer hover:bg-mainColor/5 transition-colors"
                        onClick={() => handleItemClick(item.name)}
                      >
                        <span className="text-textColor text-sm">{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchMenu;