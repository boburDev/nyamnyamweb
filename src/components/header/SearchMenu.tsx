"use client";
import { useState } from "react";
import { Input } from "../ui/input";
import { SearchIcon } from "@/assets/icons";
import useStore from "@/context/store";

const SearchMenu = () => {
  const [search, setSearch] = useState("");
  const auth = useStore((state) => state.auth);
  return (
    <div className={`relative w-full ${auth ? "ml-[130px]" : "ml-[58px]"}`}>
      <Input
        onChange={(e) => setSearch(e.target.value)}
        value={search}
        className="!bg-white shadow-none h-12 rounded-[15px] py-2 pl-[38px] text-[15px] w-full text-textColor"
      />
      <span className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer">
        <SearchIcon />
      </span>
    </div>
  );
};

export default SearchMenu;
