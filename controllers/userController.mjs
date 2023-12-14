import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function generateToken(user) {
  const payload = {
    userId: user.userId,
    username: user.username,
    email: user.email,
  };
  const secretKey = process.env.JWT_SECRET_KEY;
  const options = { expiresIn: "1h" }; // Token expiration time (1 hour in this example)
  return jwt.sign(payload, secretKey, options);
}

export async function registerUser(req, res) {
  try {
    const { username, email, password } = req.body;
    // console.log(username);

    // Check if the username or email is already taken
    const { data: existingUser, error } = await supabase
      .from("Users")
      .select()
      .eq("email", email);

    // console.log({ existingUser });

    if (existingUser !== null && existingUser.length !== 0) {
      return res
        .status(400)
        .json({ error: "Email is already associated with an account." });
      // console.log(error);
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds: 10

    // Create a new user in the database
    const { data: newUser, error: createUserError } = await supabase
      .from("Users")
      .upsert({
        username,
        email,
        password: hashedPassword,
      })
      .select();

    // console.log(newUser);

    if (createUserError) {
      console.error(createUserError);
      return res.status(500).json({ error: "error in creating user" });
    }

    // Generate a JWT token for the newly registered user
    const token = newUser ? generateToken(newUser[0]) : null;
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

    // Find the user in the database based on the email
    const { data: users, error } = await supabase
      .from("Users")
      .select("userId, username, email, password")
      .eq("email", email);

    const user = users ? users[0] : null;

    if (!user) {
      throw res.status(401).json({ error: "Invalid credentials" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw res.status(401).json({ error: "Invalid credentials" });
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
