import jwt from 'jsonwebtoken';

// login seller : /api/seller/login
export const sellerLogin = async (req, res) => {
    try{
        const { email, password } = req.body;

    if(password === process.env.SELLER_PASSWORD && email === process.env.SELLER_EMAIL){
        const token= jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('sellerToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        return res.json({ success: true, message: "Logged In" });

    }else{
        return res.json({ success: false, message: "Invalid Credentials" });
    }
    }catch(error){
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Seller isauth: /api/seller/is-auth
export const isSellerAuth = async (req, res) => {
    try {
        return res.json({ success: true });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// logout seller : /api/seller/logout
export const sellerLogout =async (req, res) => {
    try{
        res.clearCookie('sellerToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'strict',
        });
        return res.json({success: true, message: "logged out"});
    } catch(error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}