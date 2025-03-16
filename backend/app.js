import express from "express";
import { createUser, login } from "./auth.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Received Data:", req.body); 
    if (
      !email ||
      !email.includes("@") ||
      !password ||
      password.trim().length < 8
    ) {
      console.log("Validation Failed"); 
      return res.status(400).send({ error: "Invalid email or password" });
    }


    const token = createUser(email, password);
    res.status(201).send({ message: "User created successfully", token });
  } catch (error) {
    res.status(400).send({ error: "email already in use" });
  }
});

app.post("/login", async (req, res) => {
  try {
    console.log("Received Data:", req.body); 
    const { email, password } = req.body;
    const token = login(email, password);

    res.status(200).send({ message: "User logged in successfully", token });
  } catch (error) {
    if (error.status == 400) {
      return res.status(400).send({ error: error.message });
    }
    res.status(500).send({ error: "login failed, please check your credintials" });
  } 
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
