import { createContext, useContext, useState } from "react";

const ScreenModeContext = createContext(null);

export function ScreenModeProvider({ children }) {
  const [mode, setMode] = useState("preview"); // preview | live

  function toggleMode() {
    setMode(m => (m === "preview" ? "live" : "preview"));
  }

  return (
    <ScreenModeContext.Provider value={{ mode, setMode, toggleMode }}>
      {children}
    </ScreenModeContext.Provider>
  );
}

export function useScreenMode() {
  const ctx = useContext(ScreenModeContext);
  if (!ctx) {
    throw new Error("useScreenMode must be used inside ScreenModeProvider");
  }
  return ctx;
}
