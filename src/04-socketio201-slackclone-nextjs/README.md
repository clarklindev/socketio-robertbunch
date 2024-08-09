## ENVIRONMENT VARIABLES

### (CLIENT + SERVER) REQUIRED

- `SERVER_PORT`:
  This is crucial for the server. It defines which port the server will listen on for incoming connections. In your case, you’ve set SERVER_PORT=3000, so your server will listen on port 3000 for incoming HTTP requests.

### CLIENT REQUIRED

- `SERVER_URL`:
  This is typically used by the client to know the URL of the server to connect to. For server-side code, you generally don’t need to specify SERVER_URL unless you are using it for some specific internal purposes or configurations.

### SERVER REQUIRED

- `FRONTEND_URL`:
  This is used to configure CORS (Cross-Origin Resource Sharing) on the server. It tells the server which origin (frontend URL) is allowed to make requests to it. This is important for security to ensure that only trusted origins can access your server’s resources.

- `FRONTEND_PORT`:
  This works in conjunction with FRONTEND_URL to specify the complete origin (e.g., http://localhost:3000). It helps define the exact port where the frontend application is running. The server uses this to allow or deny requests based on the origin.

## Populating Database (Namespace and Rooms)

- created mongoose models for Namespace and Room and Message.
- after initiating mongodb via mongoose you have ability to add Namespaces, Rooms via POSTMAN
- the server is now able to get the namespaces directly from the db

### Namespace

```js
//USE server API and POST body:
fetch("http://localhost:3000/api/namespaces", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    data: {
      name: "My New Namespace",
      image: "http://example.com/image.jpg",
      endpoint: "/my-new-namespace",
    },
  }),
});
```

## Rooms

```js
fetch("http://localhost:3000/api/namespaces/add-room", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    namespaceId: "64b06d3e3a99a5e8c89f30e2", // Example ObjectId
    roomData: {
      roomTitle: "General",
      privateRoom: false,
      // history: [],
    },
  }),
});
```
