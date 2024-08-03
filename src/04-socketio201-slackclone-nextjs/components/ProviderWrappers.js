import React from "react";

import { NotificationContextProvider } from "@/context/chat/SocketContext";

const ProvidersWrapper = ({ children }) => {
  return (
    <>
      <NotificationContextProvider>{children}</NotificationContextProvider>
    </>
  );
};

export default ProvidersWrapper;
