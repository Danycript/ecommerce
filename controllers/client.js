
import { pool } from "../db.js";
import { variationDetails } from "./querys.js";

export const variations = async (req,res)=>{
    try {
      const results = await pool.query(variationDetails); 
      res.status(200).json(results.rows);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
}