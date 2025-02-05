import { sign, verify } from 'jsonwebtoken';
import * as jose from 'jose';

const secret = process.env.JWT_SECRET as string;

export const signToken = (payload: { email: string;  _id: string}) => {
    return sign(payload, secret, { expiresIn: '1d' });   
}

export const verifyToken = (token: string) => {
    return verify(token, secret);
}

export const verifyWithJose = async <T>(token: string) => {
    const SECRET = new TextEncoder().encode(secret);
    const {payload} = await jose.jwtVerify<T>(token, SECRET); {
        return payload;
    }
}