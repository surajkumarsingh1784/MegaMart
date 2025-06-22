import React from 'react'
import { useAppContext } from '../context/AppContext'
import { useParams } from 'react-router-dom'
import { categories } from '../assets/assets'
import ProductCard from '../components/ProductCard'

const ProductCategory = () => {
    const {Products} = useAppContext()
    const {category} = useParams()
    const searchCategory = categories.find((item) => item.path.toLowerCase() === category)
    const FilteredProducts = Products.filter((product) => {
      if (Array.isArray(product.category)) {
        return product.category.some(
          cat => cat && cat.toLowerCase() === category.toLowerCase()
        );
      }
      return product.category && product.category.toLowerCase() === category.toLowerCase();
    })
    console.log('URL category param:', category);
    console.log('All products:', Products);
    console.log('Filtered products:', FilteredProducts);

  return (
    <div className='mt-16'>
        {searchCategory && (
    <div className='flex flex-col items-end w-max'>
        <p className='text-2xl font-medium'>{searchCategory.text.toLowerCase()}</p>
        <div className="w-16 h-0.5 bg-primary rounded-full"></div>
    </div>
)}
{FilteredProducts.length > 0 ? (
    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6  mt-6'>
        {FilteredProducts.map((product)=> (
            <ProductCard key={product._id} product={product} />
        ))}
    </div>
): ( 
<div className='flex items-center justify-center h-[60vh]'>
    <p className='text-2xl font-medium text-primary'>No product found in this category.</p>
</div>
)}
{Products.length === 0 && (
  <div className='flex items-center justify-center h-[60vh]'>
    <p className='text-2xl font-medium text-primary'>No products loaded from backend.</p>
  </div>
)}
    </div>
  )
  
}

export default ProductCategory