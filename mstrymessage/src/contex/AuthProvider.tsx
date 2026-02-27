"use client";

import { SessionProvider } from "next-auth/react";
// import { Dashboard } from "./Dashboard";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
