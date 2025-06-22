import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import MegaMart from '../../assets/MegaMart.png';

const SellerLogin = () => {
    const { IsSeller, setIsSeller, axios } = useAppContext();
    const [email, setEmail] = useState("admin@example.com");
    const [password, setPassword] = useState("greatstack123");
    const navigate = useNavigate();

    const onSubmitHandler = async (event) => {
        try{
            event.preventDefault();
            const { data } = await axios.post("/api/seller/login", {email, password});
            if (data.success) {
                setIsSeller(true); 
                navigate("/seller");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
        toast.error(error.message);
    }
}


    useEffect(() => {
        if (IsSeller) {
            navigate("/seller");
        }
    }, [IsSeller, navigate]);

    return !IsSeller && (
        <div className="min-h-screen flex items-center text-sm text-gray-600 relative">
            <img src={MegaMart} alt="MegaMart logo" className="h-11.5 -mt-2 absolute left-8 top-5 z-10 cursor-pointer" onClick={() => navigate('/')} />
            <form onSubmit={onSubmitHandler} className='flex flex-col gap-5 m-auto items-start p-8 py-12 min-w-80 sm:min-w-88 rounded-lg shadow-xl border border-gray-200'>
                <p className='text-2xl font-medium m-auto'><span className="text-primary">Seller</span>Login</p>
                <div className='w-full '>
                    <p>Email</p>
                    <input onChange={(e) => setEmail(e.target.value)} value={email}
                        type="email" placeholder="enter your email" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" required />
                </div>
                <div className='w-full '>
                    <p>Password</p>
                    <input onChange={(e) => setPassword(e.target.value)} value={password}
                        type="password" placeholder="enter your password" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" required />
                </div>
                <button type="submit" className="bg-primary text-white w-full py-2 rounded-md cursor-pointer">Login</button>
            </form>
        </div>
    )
}

export default SellerLogin