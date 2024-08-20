import Namespace from "../../../lib/socket/db/models/NamespaceModel.js";
import Room from "../../../lib/socket/db/models/RoomModel.js";

export async function addRoomToNamespace(req, res, next) {
  console.log("FUNCTION: addRoomToNamespace");

  const { namespaceId, roomData } = req.body;

  try {
    // 1. Check if the namespace exists
    const namespace = await Namespace.findById(namespaceId);
    if (!namespace) {
      return res.status(404).json({
        status: "ERROR",
        message: "Namespace not found",
      });
    }

    // 2. Create a new room
    const newRoom = new Room({
      namespaceId: namespace._id,
      roomTitle: roomData.roomTitle,
      privateRoom: roomData.privateRoom,
      history: roomData.history || [],
    });

    await newRoom.save();

    // 3. Add room reference to the namespace
    namespace.rooms.push(newRoom._id);
    await namespace.save();

    // 4. Format response
    const response = {
      status: "SUCCESS",
      message: "Room added to namespace successfully",
      room: newRoom,
    };

    // 5. Send response
    return res.status(201).json(response);
  } catch (error) {
    console.error("Error adding room to namespace:", error);

    // Send an error response
    return res.status(500).json({
      status: "ERROR",
      message: "An error occurred while adding the room to the namespace",
    });
  }
}
