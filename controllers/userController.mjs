// import dotenv from "dotenv";

// dotenv.config();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.mjs";
import { Op } from "sequelize";

// const { JWT_SECRET_KEY } = process.env;

// Function to generate a JWT token
function generateToken(User) {
  const payload = {
    userId: User.id,
    username: User.username,
    email: User.email,
  };
  const secretKey =
    "3ea4de9d416737468696bcb61b518f8f59ba98fc925c7369b61c0974e5fceb69";
  const options = { expiresIn: "1h" }; // Token expiration time (1 hour in this example)
  return jwt.sign(payload, secretKey, options);
}

// Controller function to register a new user
export async function registerUser(req, res) {
  try {
    const { username, email, password } = req.body;

    // Check if the username or email is already taken
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Username or email is already taken." });
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds: 10

    // Create a new user in the database
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Generate a JWT token for the newly registered user
    const token = generateToken(newUser);
    res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });

    return res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// Controller function to authenticate a user
export async function authenticateUser(req, res) {
  try {
    const { email, password } = req.body;

    // Find the user in the database based on the username
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate a JWT token for the authenticated user
    const token = generateToken(user);
    res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });

    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
