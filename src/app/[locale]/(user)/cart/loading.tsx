import {  ProductSkeletonGrid } from '@/components/loader'
import React from 'react'

const CartLoading = () => {
  return (
    <div>
        <ProductSkeletonGrid count={8}/>
    </div>
  )
}

export default CartLoading