import React from 'react'

const TabsLoader = () => {
    return (
        <div className="flex gap-[15px]">
            {[1, 2, 3, 4, 5].map((i) => (
                <div
                    key={i}
                    className="h-12 w-24  rounded-[25px] skeleton-puls"
                />
            ))}
        </div>
    )
}

export default TabsLoader