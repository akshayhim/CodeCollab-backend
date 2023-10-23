import Project from "../models/project.mjs"; // Import the Project model

// Controller function to create a new project
export async function createProject(req, res) {
  try {
    const { projectName } = req.body;

    // Create a new project in the database
    const newProject = await Project.create({
      projectName,
      // Add other project properties as needed
    });

    return res.status(201).json(newProject);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// Controller function to get all projects
export async function getAllProjects(req, res) {
  try {
    // Retrieve all projects from the database
    const projects = await Project.findAll();

    return res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// Controller function to get a specific project by ID
export async function getProjectById(req, res) {
  try {
    const { projectId } = req.params;

    // Retrieve the project from the database based on projectId
    const project = await Project.findByPk(projectId);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    return res.status(200).json(project);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// Controller function to update a project by ID
export async function updateProject(req, res) {
  try {
    const { projectId } = req.params;
    const { projectName } = req.body;

    // Find the project by ID and update its properties
    const [updatedRowsCount, updatedProjects] = await Project.update(
      { projectName },
      { returning: true, where: { id: projectId } }
    );

    if (
      updatedRowsCount === 0 ||
      !updatedProjects ||
      updatedProjects.length === 0
    ) {
      return res.status(404).json({ error: "Project not found" });
    }

    return res.status(200).json(updatedProjects[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// Controller function to delete a project by ID
export async function deleteProject(req, res) {
  try {
    const { projectId } = req.params;

    // Delete the project from the database based on projectId
    const deletedRowCount = await Project.destroy({ where: { id: projectId } });

    if (deletedRowCount === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
