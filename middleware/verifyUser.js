import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error";

export const verifyUser = async (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return next(errorHandler(401, "unUthorized"));
  
};
