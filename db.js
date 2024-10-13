import pkg from "pg";

const { Pool } = pkg;

export const pool = new Pool({
  user: "Cyrus",
  host: "db",
  database: "E-commerce_DB",
  password: "Cript#",
  port: 5432,
});
