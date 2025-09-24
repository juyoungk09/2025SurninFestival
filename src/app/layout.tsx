"use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "../components/Header";
import { auth } from "../lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { handleUser } from "../lib/auth";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setUser(user);
          handleUser(user);
        });
        return () => unsubscribe();
      }, []);
  return (
    <html lang="en">
      <body
        className="antialiased bg-neutral-950 text-neutral-100 box-border min-h-screen"
      >
        <Header user={user}/>
        {children}
      </body>
    </html>
  );
}
