import React from 'react'

const BlockSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
    return <div className={`bg-gray-200 rounded-md animate-pulse ${className}`} />
}

export default BlockSkeleton