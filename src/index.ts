import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express, { Express, Request, Response } from "express";
import session from "express-session";
import { config } from "dotenv";
// Configure environment variables
config();

import AuthenticationRouter from "./routes/v1/authentication";

const app: Express = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  session({
    resave: true,
    secret: "insecureSecret",
    saveUninitialized: false,
  })
);
const PORT: string = process.env.PORT || "80";

app.get("/", (req: Request, res: Response) => {
  res
    .status(200)
    .send(
      `Hello, World! Your access token is ${
        req.session.accessToken || "not set"
      }.`
    );
});

app.use("/api/v1/authentication", AuthenticationRouter);

app.listen(PORT);
