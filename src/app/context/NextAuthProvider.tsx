"use client";
import { SessionProvider } from "next-auth/react";
import { FC, ReactNode } from "react";

interface NextAuthProviderProps {
  children: ReactNode;
}

const NextAuthProvider: FC<NextAuthProviderProps> = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default NextAuthProvider;
