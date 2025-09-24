"use client";
import Link from "next/link";
import { signInWithGoogle } from "../lib/auth";
import { useState, useEffect } from "react";
import Image from "next/image";
import { auth } from "../lib/firebase";
import { onAuthStateChanged, User, signOut } from "firebase/auth";

export const Header = ({user}: {user: User | null}) => {
    const handleSignUp = () => {
        signInWithGoogle();
    };
    const handleSignOut = () => {
        signOut(auth);
    };
  return (
    <header className="sticky top-0 z-50 bg-neutral-950/70 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/60 border-b border-white/10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-sm sm:text-base font-semibold tracking-tight bg-gradient-to-br from-sky-400 via-fuchsia-400 to-amber-300 text-transparent bg-clip-text">Teuk.com</span>
          </Link>

          <nav className="hidden sm:flex items-center gap-1 text-sm">
            <Link href="/" className="px-3 py-2 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition">Home</Link>
            <Link href="/sunrinf1" className="px-3 py-2 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition">Sunrin Festival 1</Link>
            <Link href="/sunrinf2" className="px-3 py-2 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition">Sunrin Festival 2</Link>
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
                <div className="flex items-center gap-2">
                    <Image src={user.photoURL!} alt={user.displayName!} width={32} height={32} className="rounded-full" />
                    <p className="text-xs sm:text-sm font-medium text-white/80">{user.displayName}</p>
                    <button className="px-3 py-1.5 rounded-md bg-purple-600 text-white text-xs sm:text-sm font-medium shadow hover:opacity-95 transition"
                        onClick={handleSignOut}>
                        로그아웃
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 rounded-md bg-purple-600 text-white text-xs sm:text-sm font-medium shadow hover:opacity-95 transition"
                        onClick={handleSignUp}>
                        로그인
                    </button>
                </div>
            )}
          </div>
        </div>
      </div>    
    </header>
  );
};