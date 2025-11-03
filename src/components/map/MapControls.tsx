import { RefreshCw } from "lucide-react";

interface MapControlsProps {
    onRefresh: () => void;
}

export const MapControls = ({ onRefresh }: MapControlsProps) => {
    return (
        <div className="absolute top-4 left-4 lg:left-1/2 lg:-translate-x-1/2 z-20 space-y-3">
            {/* Refresh Map Button */}
            <div className="bg-mainColor rounded-full border border-white relative">
                <button
                    onClick={onRefresh}
                    className="px-4 py-2 text-white text-[13px] font-medium flex items-center gap-2 hover:bg-mainColor rounded-full transition-colors"
                >
                    <RefreshCw size={16} />
                    XARITANI YANGILASH
                </button>
            </div>
        </div>
    );
};
