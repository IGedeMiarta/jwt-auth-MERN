import express from "express";
import { getUser,Register,Login,Logout } from "../controller/User.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refrehToken } from "../controller/RefreshToken.js";

const router = express.Router();

router.get("/users",verifyToken,getUser);
router.post("/users",Register);
router.post("/login",Login);
router.get("/token",refrehToken);
router.delete("/logout",Logout);


export default router;