import File from '../models/file.mjs'; // Import the File model

// Controller function to create a new file
export async function createFile(req, res) {
  try {
    const { projectId, fileName, content } = req.body;

    // Create a new file in the database
    const newFile = await File.create({
      projectId,
      fileName,
      content,
      // Add other file properties as needed
    });

    return res.status(201).json(newFile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Controller function to get all files for a specific project
export async function getFilesByProjectId(req, res) {
  try {
    const { projectId } = req.params;

    // Retrieve all files for the specified project from the database
    const files = await File.findAll({ where: { projectId } });

    return res.status(200).json(files);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Controller function to update a file by ID
export async function updateFile(req, res) {
  try {
    const { fileId } = req.params;
    const { content } = req.body;

    // Find the file by ID and update its content
    const [updatedRowCount] = await File.update(
      { content },
      { where: { id: fileId } }
    );

    if (updatedRowCount === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    return res.status(200).json({ message: 'File updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Controller function to delete a file by ID
export async function deleteFile(req, res) {
  try {
    const { fileId } = req.params;

    // Delete the file from the database based on fileId
    const deletedRowCount = await File.destroy({ where: { id: fileId } });

    if (deletedRowCount === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
