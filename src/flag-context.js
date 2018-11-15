import { createContext } from "react";

export const FlagContext = createContext({
  addFlag: () => false,
  dismissFlag: () => false
});
