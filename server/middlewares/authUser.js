import jwt from 'jsonwebtoken';

const authUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ success: false, message: 'Not authorized' });
    }
    try {
        const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
        if (tokenDecoded.id) {
            req.userId = tokenDecoded.id;
            next();
        } else {
            return res.json({ success: false, message: 'Not authorized' });
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export default authUser;