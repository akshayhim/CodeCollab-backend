// Import the required modules using ESM syntax
import { Router } from "express";
import authenticateToken from "./middleware/authMiddleware.mjs";

// Import your route handlers (controllers) here using ESM syntax
import {
  registerUser,
  authenticateUser,
} from "./controllers/userController.mjs";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "./controllers/projectController.mjs";
import {
  createFile,
  updateFile,
  deleteFile,
  getFilesByProjectId,
} from "./controllers/fileController.mjs";

// Create a new Router instance using ESM syntax
const router = Router();

// Define your routes using ESM syntax

router.post("/register", registerUser); // User registration route
router.post("/login", authenticateUser); // User login route

router.use(authenticateToken);

router.post("/projects", createProject); // Create a new project
router.get("/projects", getAllProjects); // Get all projects
router.get("/projects/:projectId", getProjectById); // Get a specific project by ID
router.put("/projects/:projectId", updateProject); // Update an existing project
router.delete("/projects/:projectId", deleteProject); // Delete a project

router.post("/projects/:projectId/files", createFile); // Create a new file in a project
router.put("/projects/:projectId/files/:fileId", updateFile); // Update a file in a project
router.get("/projects/:projectId/files", getFilesByProjectId); // Get files by project ID
router.delete("/projects/:projectId/files/:fileId", deleteFile); // Delete a file from a project

router.use((err, req, res, next) => {
  // Handle errors and send appropriate responses
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal Server Error" });
});

// Export the Router instance using ESM syntax
export default router;
