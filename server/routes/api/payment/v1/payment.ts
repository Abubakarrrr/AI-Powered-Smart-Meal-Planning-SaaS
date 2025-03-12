import { checkout } from "@controllers/payment.controller";
import { verifyJWT } from "@middlewares/auth";
import express from "express";
const router = express.Router();

router.post("/stripe",checkout);

export default router