"use server"; //-----> note: use server is inside function

export async function handleMessage(formData) {
  // Call the server action directly from the client
  const message = formData.get("message");
  console.log("message:", message);

  nameSpaceSockets[selectedNsId].emit("newMessageToRoom", {
    newMessage,
    date: Date.now(),
    avatar: "https://via.placeholder.com/30",
    userName,
    selectedNsId,
  });

  //reset input to ""
}
