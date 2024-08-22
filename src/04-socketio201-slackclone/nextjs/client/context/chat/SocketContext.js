'use client';
import io from "socket.io-client";
import { createContext, useReducer, useEffect, useContext} from "react";

//create context
const SocketContext = createContext({
  socket:null
});//if you want auto completion, the passed in object needs the skeleton of functions, constants avail

//prop is the initial context
const initialState = {
  nameSpaceSockets: [],
  listeners: { nsChange: [], messageToRoom: [] },
  selectedNsId: null, //a global variable we update when the user updates the namespace
  socket: null,
};

//reducer
const reducer = (state, action) => {
  switch (action.type) {
    case "set_socket":
      return {
        ...state,
        socket: action.payload,
      };
    default:
      return state;
  }
};

// Socket Provider Component
export function SocketContextProvider({ children }) {
  
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {

    console.log('ENV NEXT_PUBLIC_SERVER_URL:', process.env.NEXT_PUBLIC_SERVER_URL);
    console.log('ENV NEXT_PUBLIC_SERVER_PORT:', process.env.NEXT_PUBLIC_SERVER_PORT);

    // Initialize socket connection
    const newSocket = io(`${process.env.NEXT_PUBLIC_SERVER_URL}:${process.env.NEXT_PUBLIC_SERVER_PORT}`);
    console.log('newSocket: ', newSocket);

    dispatch({
      type: "set_socket",
      payload: newSocket,
    });

    // Cleanup on component unmount
    return () => {
      console.log('CLEANUP SocketContextProvider')
      newSocket.disconnect();
    };
  }, []);
  
  return (
    <SocketContext.Provider value={{socket: state.socket}}>
      {children}
    </SocketContext.Provider>
  );
}

// Custom Hook for Using Socket
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketContextProvider");
  }
  return context;
};

