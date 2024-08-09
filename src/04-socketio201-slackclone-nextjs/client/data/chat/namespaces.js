//USE server API and pass POST body:

//add namespace
// fetch("http://localhost:3000/api/namespaces", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify({
//     data: {
//       name: "My New Namespace",
//       image: "http://example.com/image.jpg",
//       endpoint: "/my-new-namespace",
//     },
//   }),
// });

//add room
// fetch("http://localhost:3000/api/namespaces/add-room", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       namespaceId: "64b06d3e3a99a5e8c89f30e2", // Example ObjectId
//       roomData: {
//         roomTitle: "General",
//         privateRoom: false,
//         // history: [],
//       },
//     }),
//   });

//--------------------------------------------------------------------------------------------------
//BELOW IS DEPRECATED... USE SERVER API

// import Namespace from "@/lib/chat/Namespace";
// import Room from "@/lib/chat/Room";

// Namespace(id, name, image, endpoint)
//.addRoom()

//here we are hardcoding; in production: connect to database to get data
// const wikiNs = new Namespace(
//   0,
//   "Wikipedia",
//   "https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/103px-Wikipedia-logo-v2.svg.png",
//   "/wiki"
// );

// const mozillaNs = new Namespace(
//   1,
//   "Mozilla",
//   "https://www.mozilla.org/media/img/logos/firefox/logo-quantum.9c5e96634f92.png",
//   "/mozilla"
// );

// const linuxNs = new Namespace(
//   2,
//   "Linux",
//   "https://upload.wikimedia.org/wikipedia/commons/a/af/Tux.png",
//   "/linux"
// );

// // 29. rooms and namespaces - ADD ROOMS TO NAMESPACES

//(roomId, title, namespaceId, isPrivate)

// wikiNs.addRoom(new Room(0, "news articles", 0));
// wikiNs.addRoom(new Room(1, "editors", 0));
// wikiNs.addRoom(new Room(2, "other", 0, true));

// mozillaNs.addRoom(new Room(0, "firefox", 1));
// mozillaNs.addRoom(new Room(1, "seaMonkey", 1));
// mozillaNs.addRoom(new Room(2, "spiderMonkey", 1));
// mozillaNs.addRoom(new Room(3, "rust", 1));

// linuxNs.addRoom(new Room(0, "Debian", 2));
// linuxNs.addRoom(new Room(1, "Red hat", 2));
// linuxNs.addRoom(new Room(2, "Ubuntu", 2));
// linuxNs.addRoom(new Room(3, "MacOS", 2));

// const namespaces = [wikiNs, mozillaNs, linuxNs];

// export { namespaces };
