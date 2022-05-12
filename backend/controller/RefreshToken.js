import Users from "../models/UserModel.js";
import jwt from "jsonwebtoken";

export const refrehToken = async(req,res) => {
    try {
        const refrehToken = req.cookies.refreshToken;
        if(!refrehToken) return res.status(401).json({ message: "Not authorized" });
        const user = await Users.findOne({
            where:{
                refresh_token:refrehToken
            }
        });
        if(!user) return res.status(403).json({ message: "Not authorized" });
        jwt.verify(refrehToken,process.env.REFRESH_TOKEN_SECRET,(err,decoded) => {
            if(err) return res.status(403).json({ message: "Not authorized" });
            const userId = user.id;
            const name = user.name;
            const email = user.email;
            const accessToken = jwt.sign({ userId, name, email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "20s" });
            res.json({ accessToken });
        })
    } catch (error) {
        console.log(error);
    }
}