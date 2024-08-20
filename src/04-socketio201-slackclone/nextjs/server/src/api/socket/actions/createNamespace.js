import Namespace from "../../../lib/socket/db/models/NamespaceModel.js";

export async function createNamespace(req, res, next) {
  const { data } = req.body; // Assume 'data' contains the namespace information
  console.log(data);

  try {
    // 1. Check if the namespace already exists
    const existingNamespace = await Namespace.findOne({
      endpoint: data.endpoint,
    });

    if (existingNamespace) {
      // 2. Namespace already exists
      return res.status(400).json({
        status: "ERROR",
        message: "Namespace already exists",
      });
    }

    // 2. Create a new namespace
    const newNamespace = new Namespace({
      name: data.name,
      image: data.image,
      endpoint: data.endpoint,
    });

    await newNamespace.save();

    // 3. Format response
    const response = {
      status: "SUCCESS",
      message: "Namespace created successfully",
      namespace: newNamespace,
    };

    // 4. Send response
    return res.status(201).json(response);
  } catch (error) {
    console.error("Error creating namespace:", error);

    // Send an error response
    return res.status(500).json({
      status: "ERROR",
      message: "An error occurred while creating the namespace",
    });
  }
}
