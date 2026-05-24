import jwt from "jsonwebtoken";

export const isAuth = async (req,res,next) => {
    try {
        const {token} =  req.cookies;
        if(!token){
            return res.status(401).json({message:"User doesn't have a token"});
        }
        
        const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
        
        if(!verifyToken){
            return res.status(401).json({message:"User token is not valid"});
        }
        
        req.user = verifyToken;
        next();
    } catch (error) {
        // Handle JWT-specific errors as 401 (unauthorized)
        // if (error.name === 'JsonWebTokenError' || 
        //     error.name === 'TokenExpiredError' || 
        //     error.name === 'NotBeforeError') {
        //     return res.status(401).json({message:"Invalid or expired token"});
        // }
        
        // Other errors as 500 (server error)
        return res.status(500).json({message:`Auth Middleware error ${error}`});
    }
}

export default isAuth;