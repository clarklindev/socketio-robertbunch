import Namespace from "../../../lib/socket/db/models/NamespaceModel.js";

export async function getNamespaces(req, res) {
  try {
    const namespaces = await Namespace.find().exec();
    res.json(namespaces);
  } catch (error) {
    console.error("Error fetching namespaces:", error);
    res.status(500).json({ error: "Error fetching namespaces" });
  }
}
