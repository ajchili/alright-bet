import express, { Express, Request, Response } from "express";
import { config } from "dotenv";
import { Pool } from "pg";

config();

const app: Express = express();
const PORT: string = process.env.PORT || "80";

app.get("/", (_: Request, res: Response) => {
  res.status(200).send("Hello, World!");
});

app.get("/now", (_: Request, res: Response) => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  pool.query("SELECT NOW()", (err, response) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.status(200).json(response);
    }
    pool.end();
  });
});

app.listen(PORT);
