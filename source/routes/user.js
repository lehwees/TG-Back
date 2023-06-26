import { Router } from "express";
import bcrypt from "bcrypt";
import prisma from "../services/prisma.js";
import userSchema from "../schemas/userSchema.js";
import jwt from "jsonwebtoken";

const userRouter = Router();
const SECRET_KEY = process.env.SECRET_KEY;

userRouter.post("/register", async (req, res) => {
  const userData = req.body;

  try {
    const newUser = await userSchema.validate(userData);

    const hashPW = await bcrypt.hash(newUser.password, 10);

    const response = await prisma.user.create({
      data: { ...newUser, password: hashPW },
    });

    if (response) {
      res.sendStatus(201);
      return;
    }

    res.sendStatus(500);
  } catch (error) {
    res.send({ data: { message: error.errors} }).status(422);
  }
});

userRouter.post("/login", async (req, res) => {
  const userData = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: userData.email,
      },
      select: {
        email: true,
        password: true,
      },
    });
    console.log(user)

    if (!user) {
      res.sendStatus(401);
      return;
    }

    if (bcrypt.compare(userData.password, user.password)) {
      const token = await jwt.sign(userData.email, SECRET_KEY);
      res.send({ data: { token } });
      return;
    }
  } catch (error) {
    res.sendStatus(500);
  }
});

userRouter.get("/profile", async (req, res) => {
  const token = req.headers["x-access-token"];

  try {
    if (!token) {
      res.sendStatus(401);
      return;
    }
    const userData = jwt.verify(token, SECRET_KEY);

    if (!userData) {
      res.sendStatus(401);
      return;
    }

    const userProfile = await prisma.user.findUnique({
      where: {
        email: userData,
      },
      select: {
        name:true, 
        email: true
      }
    });

    res.send(userProfile);
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.sendStatus(401);
      return;
    }

    res.sendStatus(500);
  }
});

export default userRouter;
