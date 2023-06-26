import express from "express";
import cors from "cors";
import userRouter from "./routes/user.js";

const PORT = process.env.PORT;

const app = express();

app.use(cors());

app.use(express.json());

app.use("/user", userRouter);

app.listen(PORT, () => {
  console.log("Server running on port: " + PORT);
});
