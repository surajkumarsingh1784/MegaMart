import React, { useEffect, useState} from 'react'
import { useAppContext } from '../context/AppContext'
import ProductCard from '../components/ProductCard'



const AllProducts = () => {

    const {Products, searchQuery} =useAppContext();
    const [FilteredProducts, setFilteredProducts] = useState([])

    useEffect(() => {
      if(searchQuery.length > 0){
        setFilteredProducts(Products.filter(
          (product) => product.name.toLowerCase().includes(searchQuery.toLowerCase())
        ))}else{
        setFilteredProducts(Products);
        }
      // Debug log to check all products received from backend
      console.log('All products from backend:', Products);
      },[Products, searchQuery])
  return (
    <div className='mt-16 flex flex-col'>
        <div className='flex flex-col items-end w-max'>
    <p className='text-2xl font-medium uppercase'>All Products</p>
    <div className='w-16 h-0.5 bg-primary rounded-full'></div>
        </div>

    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6'>
    {FilteredProducts.map((product, index) => (
      <ProductCard key={index} product={product} />
    ))}
   
    </div>

    </div>
  )
}

export default AllProducts