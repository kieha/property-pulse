"use client";

import { createContext, useContext, useState } from "react";

// create context
type GlobalContextType = {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
};

const GlobalContext = createContext<GlobalContextType>({
  unreadCount: 0,
  setUnreadCount: () => {},
});

// create provider
export function GlobalProvider({ children }: { children: React.ReactNode }) {
  const [unreadCount, setUnreadCount] = useState<number>(0);

  return (
    <GlobalContext value={{ unreadCount, setUnreadCount }}>
      {children}
    </GlobalContext>
  );
}

// create custom hook to access context
export function useGlobalContext() {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
}
