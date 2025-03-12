import { IUser } from "@models/User";
import { Request, Response } from "express";

interface RequestWithUser extends Request {
  user?: IUser;
}
export const checkout = async (req:Request,res:Response)=>{
    try {
        console.log("webhook here")
        res.status(200).json({success:false,message:"checkout completed"});
        return;
    } catch (error) {
        console.log(error);
    }
}