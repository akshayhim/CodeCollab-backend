// Import the required modules using ESM syntax
import { Router } from "express";
import authenticateToken from "./middleware/authMiddleware.mjs";

// Import your route handlers (controllers) here using ESM syntax
import {
  registerUser,
  authenticateUser,
} from "./controllers/userController.mjs";

// Create a new Router instance using ESM syntax
const router = Router();

// Define your routes using ESM syntax

router.post("/register", registerUser); // User registration route
router.post("/login", authenticateUser); // User login route

router.use(authenticateToken);

router.use((err, req, res, next) => {
  // Handle errors and send appropriate responses
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal Server Error" });
});

// Export the Router instance using ESM syntax
export default router;
