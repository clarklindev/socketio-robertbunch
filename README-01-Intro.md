## Section 1: introduction

### 1. welcome 
### 2. course overview
### 3. [github link](https://github.com/robertbunch/socketioTheDetails)
### 4. native websockets vs socket.io
- [socketio](https://socket.io/docs/v4/) is a wrapper library for websockets for 2-way real-time communication between browser and server.
- socketio - that provides low-latency, bi-directional, event-based communication
- sockets are persistent connection between client and server (stays connected)

- Additional features (over Websockets)
    - http long-polling fallback (socketio has a heartbeat mechanism periodically checking connection status)
    - automatic reconnection
    - packet buffering
    - acknowledgement - guarantee when events happen
    - broadcasting
    - multiplexing - single connection for multipurposes
- if you using native websockets, you're eventually have to make these features anyway, but there is team of developers maintaining the socketio library

---