import { ChartBarIncreasing } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

const SelectComponent = ({ children, value }: { children: React.ReactNode, value: string }) => {
    return (
        <Select value={value}>
            <SelectTrigger className="!bg-white rounded-[25px] px-5 !w-[130px] !h-[42px] lg:!h-[48px] lg:!w-full">
                <SelectValue>
                    <p className="hidden lg:block"><ChartBarIncreasing /></p>
                    {value}
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                <SelectItem value={value}>
                    {children}
                </SelectItem>
            </SelectContent>
        </Select>
    )
}

export default SelectComponent