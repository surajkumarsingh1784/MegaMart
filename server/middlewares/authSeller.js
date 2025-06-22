import jwt from 'jsonwebtoken';

const authSeller = async (req, res, next) => {
    if (!req.cookies || !req.cookies.sellerToken) {
        return res.json({ success: false, message: 'Not authorized' });
    }
    const { sellerToken } = req.cookies;
    try{
        const tokenDecode = jwt.verify(sellerToken, process.env.JWT_SECRET);
        if(tokenDecode.email === process.env.SELLER_EMAIL){
            next();
        }else{
            return res.json({ success: false, message: 'Not authorized' });
        }
    } catch (error) {
         res.json({ success: false, message: error.message });
    }
}
export default authSeller;