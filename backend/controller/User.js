import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getUser = async (req, res) => {
    try {
        const users = await Users.findAll({
            attributes:['id','name','email',]
        });
        res.json(users);
    } catch (error) {
        console.log(error);
    }
}
export const Register = async (req, res) => {
    const { name, email, password,confPassword } = req.body;
    if (password !== confPassword) return res.status(400).json({ message: "Password doesn't match" });
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    try {
        await Users.create({
            name: name,
            email: email,
            password: hashPassword
        });
        res.json({ message: "User created successfully" });
    } catch (error) {
        console.log(error);
    }
}

export const Login = async (req, res) => {
    try {
        const user = await Users.findOne({ 
            where: { 
                email: req.body.email 
            } 
        });
        const match = await bcrypt.compare(req.body.password, user.password);
       
        if (!match) return res.status(400).json({ message: "Invalid email or password" });
        const userId = user.id;
        const name = user.name;
        const email = user.email;
        

        const accessToken = jwt.sign({ userId, name, email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "20s" });
        const refreshToken = jwt.sign({ userId, name, email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" });
    
        await Users.update({ refresh_token:refreshToken }, { where: { id: userId } });

        res.cookie("refreshToken",refreshToken,{
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24,
        })
        res.json({ accessToken });

    } catch (error) {
        res.status(404).json({ message: "User Not Found!" });
    }
}

export const Logout = async (req, res) => {
    const refrehToken = req.cookies.refreshToken;
    if(!refrehToken) return res.status(204).json({ message: "No Content" });
    const user = await Users.findOne({
        where:{
            refresh_token:refrehToken
        }
    });
    if(!user) return res.status(204).json({ message: "No Content" });
    const userId = user.id;
    await Users.update({ refresh_token:null }, { where: { id: userId } });
    res.clearCookie("refreshToken");
    return res.sendStatus(200);
}