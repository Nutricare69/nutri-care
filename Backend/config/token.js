import jwt from 'jsonwebtoken';

const generateToken = async (userId) => {
    try {
        const token =  jwt.sign({ _id:userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
       return token;
    }catch(err){
        console.log(err);
    }
}

export default generateToken;