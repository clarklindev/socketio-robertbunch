"use client";

import { createContext, useReducer } from "react";

//prop is the initial context
const initialState = {
  nameSpaceSockets: [],
  listeners: { nsChange: [], messageToRoom: [] },
  selectedNsId: null, //a global variable we update when the user updates the namespace
  socketServer: undefined,
};

const SocketContext = createContext({
  setSocketServer: function (server) {},
});

//reducer
const reducer = (state, action) => {
  switch (action.type) {
    case "set_socket_server":
      return {
        ...state,
        socketServer: action.payload,
      };

    default:
      return state;
  }
};

export function SocketContextProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  function setSocketServer(server) {
    dispatch({
      type: "set_socket_server",
      payload: server,
    });
  }

  //this context has the structure of the initial context...
  const context = {
    setSocketServer,
  };

  return (
    <SocketContext.Provider value={context}>
      {props.children}
    </SocketContext.Provider>
  );
}

export default SocketContext;
