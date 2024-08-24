'use client';
import io from "socket.io-client";
import { createContext, useReducer, useEffect, useContext} from "react";

//prop is the initial context (only values)
const initialState = {
  namespaceList:[],
  nameSpaceSockets: [],//each namespace can hold one single socket (by design)
  listeners: { nsChange: [], messageToRoom: [] },
  selectedNsId: null, //a global variable we update when the user updates the namespace
  socket: null,
};

//create context - if you want auto completion, the passed in object needs the skeleton of functions, constants avail
//give rest of code structure (and has functions)
const SocketContext = createContext({
  ...initialState,

  //exposed functions
  setNamespaceList:()=>{},
  setNamespaceSocket:()=>{},
});


//reducer
const reducer = (state, action) => {
  switch (action.type) {
    case "set_socket":
      return {
        ...state,
        socket: action.payload,
      };

    case "set_nslist":
      return {
        ...state,
        namespaceList: action.payload
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

  function setNamespaceList(nsList){
    dispatch({
      type: "set_nslist",
      payload: nsList
    })
  }

  function setNamespaceSocket(socket){
    dispatch({
      type: "set_nssocket",
      payload: socket
    })
  }
  
  const context = {
    ...state,

    setNamespaceList, //use the real function
    setNamespaceSocket //use the real function
  }

  return (
    <SocketContext.Provider value={context}>
      {children}
    </SocketContext.Provider>
  );
}

// Custom Hook for Using Socket
export const useSocket = () => {
  const context = useContext(SocketContext);  //pass the shell context
  if (!context) {
    throw new Error("useSocket must be used within a SocketContextProvider");
  }
  return context;
};

