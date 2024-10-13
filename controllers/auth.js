import dotenv from "dotenv";
dotenv.config();

import bcryptjs from "bcryptjs";
import { pool } from "../db.js";
import jwt from "jsonwebtoken";
import { createUser } from "./querys.js";
import { errorHandler } from "../utils/error.js";
import { queryUser } from "./querys.js";

export const signup = async (req, res, next) => {
  const { first_name, last_name, password, email } = req.body;

  const requiredFields = {
    first_name,
    last_name,
    password,
    email,
  };

  if (Object.values(requiredFields).some((field) => !field))
    return next(errorHandler(400, "All fields are required"));
  if (password.length > 10)
    return next(
      errorHandler(400, "Password length should not be greater than 10")
    );
  const passwordhash = bcryptjs.hashSync(password, 10);

  try {
    const result = await pool.query(createUser, [
      first_name,
      last_name,
      email,
      passwordhash,
    ]);

    res.status(201).json({
      message: "User created successfully",
      user: result,
    });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

//SIGNING UP
export const signin = async (req, res, next) => {
  const { password, email } = req.body;

  const requiredFields = { password, email };

  if (Object.values(requiredFields).some((field) => !field))
    return next(errorHandler(400, "All fields are required"));
  try {
    const queryResult = await pool.query(queryUser, [email]);
    if (!queryResult) return next(errorHandler(404, "User not found"));
    const user = queryResult.rows[0];
    const storedPasswordHash = user.passwordhash;
    const validPassword = bcryptjs.compareSync(password, storedPasswordHash);
    if (!validPassword) return next(errorHandler(400, "Invalid password"));

    const jwtSecret =
      process.env.JWT_SECRET ||
      "X-AmzAWS4-HMAC-SHA256&X-Amz-Content-Sha256UNSIGNED-PAYLOAD&X";
    const token = jwt.sign({ id: user.id }, jwtSecret);

    const { passwordhash, ...rest } = user;

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json({
        userData: rest,
      });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

//GOOGLE SIGNUP

// const google = async (req, res, next) => {
//   const { first_name, email, photourl } = req.body;
//   if (!email) return next(errorHandler(400, "Email is required"));

//   try {
//     const queryResult = pool.query(queryUser, [email]);
//     const user = queryResult.rows[0];
//     const jwtSecret =
//       process.env.JWT_SECRET ||
//       "X-AmzAWS4-HMAC-SHA256&X-Amz-Content-Sha256UNSIGNED-PAYLOAD&X";

//     if (user) {
//       const token = jwt.sign({ id: user.id }, jwtSecret);
//       res.status(200).json({
//         user,
//         token,
//       });
//     }

//     const generatedPassword =
//       Math.random().toString(36).slice(-8) +
//       Math.random(36).toString().slice(-8);
//     const passwordHash = bcryptjs.hashSync(generatedPassword, 10);

//     const result = await pool.query(createUser, [
//       first_name,
//       email,
//       passwordHash,
//       photourl,
//     ]);
//     const newUser = result.rows[0];
//     const token = jwt.sign({ id: newUser.id }, jwtSecret);
//     res.status(201).json({
//       user,
//       token,
//     });
//   } catch (error) {
//     next(errorHandler(500, error.message));
//   }
// };
