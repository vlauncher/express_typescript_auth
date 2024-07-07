import { sign, verify } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRE = process.env.JWT_EXPIRE as string;

export const createToken = (payload: any) => {
    return sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE });
}

export const verifyToken = (token: string) => {
    return verify(token, JWT_SECRET);
}
