import React from 'react'
import { useLocation, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home' // path sahi hona chahiye
import { Toaster } from 'react-hot-toast'
import Footer from './components/Footer'
import { useAppContext } from './context/AppContext'
import Login from './components/Login'
import AllProducts from './pages/AllProducts'
import ProductCategory from './pages/ProductCategory'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import AddAddress from './pages/AddAddress'
import MyOrders from './pages/MyOrders'
import SellerLogin from './components/seller/SellerLogin'
import SellerLayout from './pages/seller/SellerLayout'
import AddProduct from './pages/seller/AddProduct'
import ProductList from './pages/seller/ProductList'
import Orders from './pages/seller/Orders'
import Loading from './components/Loading'
import Contact from './pages/Contact'


const App = () => {
  const isSellerPath = useLocation().pathname.includes("seller");
  const {showUserLogin, IsSeller} = useAppContext();

  return (
    <div className='text-default min-h-screen text-gray-700 bg-white'>
      {!isSellerPath && <Navbar />}
      {showUserLogin  ? <Login /> : null}
      <Toaster />
      <div className={`${isSellerPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/products' element={<AllProducts />} />
        <Route path="/category/:category" element={<ProductCategory />} />
        <Route path="/products/:category/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/add-address" element={<AddAddress />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/loader" element={<Loading />} />
        <Route path="/contact" element={<Contact />} />
        <Route path='/seller' element={IsSeller ? <SellerLayout/> : <SellerLogin />} >
          <Route index element={IsSeller ? <AddProduct/> : null} />
          <Route path='product-list' element={<ProductList/>} />
          <Route path='orders' element={<Orders/>} />
        </Route>
        <Route path='/seller/login' element={<SellerLogin />} />
        </Routes>
        
      </div>
      {!isSellerPath &&<Footer />}
    </div>
  )
}

export default App
