import { createContext, useContext } from "react";
import type { User } from "firebase/auth";

export const UserContext = createContext<User | null>(null);

export const useUser = () => useContext(UserContext);