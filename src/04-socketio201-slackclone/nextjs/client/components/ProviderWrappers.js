'use client';

import React from "react";

import { SocketContextProvider } from "@/context/chat/SocketContext";

const ProvidersWrapper = ({ children }) => {
  return (
    <>
      <SocketContextProvider>{children}</SocketContextProvider>
    </>
  );
};

export default ProvidersWrapper;
