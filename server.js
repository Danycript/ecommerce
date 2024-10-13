//IMPORTS
import express from "express";
import morgan from "morgan";
import { pool } from "./db.js";
import router from "./routes/client.js";
import authRoutes from "./routes/auth.js";
import helmet from "helmet";
const port = 3000;

//CONFIGURATION
const app = express();
app.use(express.json());
app.use(morgan("common"));
app.use(helmet());
app.use(helmet.crossOriginOpenerPolicy({ policy: "same-origin" }));
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.get("/", (req, res) => {
  res.send("hello wolrd");
});

app.get("/brand", async (req, res) => {
  try {
    const results = await pool.query("SELECT * FROM brand");
    res.status(200).json(results.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ROUTES
app.use("/client", router);
app.use("/auth", authRoutes);
app.listen(port, () => console.log(`Server has started on port: ${port}`));
