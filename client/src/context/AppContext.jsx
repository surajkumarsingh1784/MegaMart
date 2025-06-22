import { createContext, useContext, useEffect, useState } from "react";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { set } from "mongoose";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

function getCartCount(cartItems) {
  return Object.values(cartItems).reduce((acc, curr) => acc + curr, 0);
}
function getCartTotal(cartItems) {
  return Object.values(cartItems).reduce((acc, curr) => acc + curr, 0);
}

export const AppContextProvider = ({ children }) => {

    const Currency = import.meta.env.VITE_CURRENCY;
    const Navigate =useNavigate();
    const [user, setUser] = useState(null);
    const [IsSeller, setIsSeller] = useState(false);
    const [showUserLogin, setShowUserLogin] = useState(false);
    const [Products, setProducts] = useState([])
    const [cartItems, setCartItems] = useState([])
    const [searchQuery, setSearchQuery] = useState('');

// fatch seller status
const fetchSeller = async () => {
     try{
        const {data} = await axios.get('/api/seller/is-auth');
        if(data.success){
            setIsSeller(true);
        } else {
            setIsSeller(false);
        }
     } catch(error) {
        setIsSeller(false);
     }
    }


    // fetch user auth status
    const fetchUser = async () => {
        try{
            const {data}= await axios.get('/api/user/is-auth');
            if(data.success){
                setUser(data.user);
                setCartItems(data.user.cartItems);
        }
    } catch (error) {
        setUser(null);
    }
    }

    // fetch products from dummy data
    const FetchProducts = async () => {
        try{
            const {data}= await axios.get('/api/product/list');
            if(data.success){
                setProducts(data.products);
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    
    }

    //add product to cart
  const AddToCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if(cartData[itemId]){
        cartData[itemId] += 1;
    }else{
        cartData[itemId] = 1;
    }
    setCartItems(cartData);
    toast.success("Added to cart")
}

    //update cart items in local storage
    const UpdateCartItems = (itemId, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId] = quantity;
        setCartItems(cartData);
        toast.success("Cart updated");
    }

    //remove item from cart
    const RemoveFromCart = (itemId) => {
        let cartData = structuredClone(cartItems);
        if(cartData[itemId]){
            cartData[itemId] -= 1;
            if(cartData[itemId] === 0){
                delete cartData[itemId];
            }
        }
        toast.success("Removed from cart");
        setCartItems(cartData);
    }
// get cart total amount
const getCartTotal = () => {
    let totalCount = 0;
    for (const item in cartItems) {
        totalCount += cartItems[item];
    }
    return totalCount;
}
// get cart total Amount
const getCartAmount=() => {
    let totalAmount = 0;
    for(const items in cartItems) {
        let itemInfo = Products.find((product) => product._id === items);
        if(cartItems[items] > 0){
            totalAmount += itemInfo.offerPrice * cartItems[items];
        }
    }
    return Math.floor(totalAmount * 100) / 100;
}

    useEffect(() => {
        fetchUser();
        fetchSeller();
        FetchProducts();
    }, []);

    // update cartitem
    useEffect(()=> {
        const updateCart = async () => {
            try{
                const {data}= await axios.post('/api/cart/update', {cartItems});
                if(!data.success){
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error(error.message);
            }
        } 
        if(user) {
            updateCart();
        }
    }, [cartItems]);

    const value = {
        
        user,
        setUser,
        IsSeller,
        setIsSeller,
        showUserLogin,
        setShowUserLogin,
        Products,
        Currency,
        AddToCart,
        UpdateCartItems,
        RemoveFromCart,
        cartItems,
        searchQuery, 
        setSearchQuery,
        getCartAmount,
        getCartCount: () => getCartCount(cartItems),
        getCartTotal: () => getCartTotal(cartItems),
        axios,
        FetchProducts,
        // For backward compatibility
        addToCart: AddToCart,
        setCartItems,
        updateCartItem: UpdateCartItems,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// Custom hook to use the AppContext
export const useAppContext = () => {
    return useContext(AppContext);
};

export default AppContextProvider;