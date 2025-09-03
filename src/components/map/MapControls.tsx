import { RefreshCw } from "lucide-react";

export const MapControls = () => {
    return (
        <div className="absolute top-4 right-50 z-20 space-y-3">
            {/* Sort Type Dropdown */}
            {/* <div className="bg-white rounded-lg shadow-lg p-2">
                <select className="text-sm text-gray-700 bg-transparent border-none outline-none">
                    <option>Saralash turi</option>
                    <option>Masofa bo'yicha</option>
                    <option>Narx bo'yicha</option>
                    <option>Reyting bo'yicha</option>
                </select>
            </div> */}

            {/* Zoom Controls */}
            {/* <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                </button>
                <div className="border-t border-gray-200">
                    <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                    </button>
                </div>
            </div> */}

            {/* Location Button */}
            {/* <div className="bg-white rounded-lg shadow-lg">
                <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </button>
            </div> */}

            {/* Refresh Map Button */}
            <div className="bg-mainColor rounded-full border border-white relative">
                <button className="px-4 py-2 text-white text-[13px] font-medium flex items-center gap-2 hover:bg-mainColor rounded-full">
                    <RefreshCw size={16}/>
                    XARITANI YANGILASH
                </button>
            </div>
        </div>
    );
};
