'use client';

import io from "socket.io-client";
import { createContext, useReducer, useEffect, useContext} from "react";

//prop is the initial context (only values)
const initialState = {
  namespaceList:[],
  nameSpaceSockets: [],//each namespace can hold one single socket (by design)
  listeners: { nsChange: [], messageToRoom: [] },
  selectedNsId: null, //a global variable we update when the user updates the namespace
  defaultNamespaceSocket: null,
};

//create context - if you want auto completion, the passed in object needs the skeleton of functions, constants avail
//give rest of code structure (and has functions)
const SocketContext = createContext({
  ...initialState,
  setNamespaceList:()=>{},
  setSelectedNamespaceId: ()=>{},
});

const ActionType = Object.freeze({
  SET_NAMESPACE_LIST: 'set_nslist',
  SET_DEFAULT_NAMESPACE_SOCKET: 'set_default_namespace_socket',
  SET_SELECTED_NAMESPACE_ID: 'set_selected_namespace_id',
});

//reducer
const reducer = (state, action) => {
  switch (action.type) {
    case ActionType.SET_NAMESPACE_LIST:
      return {
        ...state,
        namespaceList: action.payload
      };
    
    case ActionType.SET_DEFAULT_NAMESPACE_SOCKET:
      return {
        ...state,
        defaultNamespaceSocket: action.payload
      }
    
    case ActionType.SET_SELECTED_NAMESPACE_ID:
      return {
        ...state,
        selectedNsId: action.payload
      }

    default:
      return state;
  }
};

// Socket Provider Component
export function SocketContextProvider({ children }) {
  
  const [state, dispatch] = useReducer(reducer, initialState);

  function setNamespaceList(nsList){
    dispatch({
      type: ActionType.SET_NAMESPACE_LIST,
      payload: nsList
    })
  }

  function setSelectedNamespaceId(nsId){
    dispatch({
      type: ActionType.SET_DEFAULT_NAMESPACE_SOCKET,
      payload: nsId
    })
  }

  function setDefaultNamespaceSocket(socket){
    dispatch({
      type: ActionType.SET_DEFAULT_NAMESPACE_SOCKET,
      payload: socket
    })
  }

  useEffect(() => {
    // Initialize socket connection - connect to default namespace '/'
    //NOTE: io() call triggers SERVER' CALL OF: `io.on("connection", ()=>{})`
    const newSocket = io(`${process.env.NEXT_PUBLIC_SERVER_URL}:${process.env.NEXT_PUBLIC_SERVER_PORT}`); 
    setDefaultNamespaceSocket(newSocket);

    // Cleanup on component unmount
    return () => {
      console.log('CLEANUP SocketContextProvider')
      newSocket.disconnect();
    };
  }, []);

  const context = {
    ...state,
    setNamespaceList,
    setSelectedNamespaceId
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

