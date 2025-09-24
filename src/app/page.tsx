"use client";
import { getCountFromServer, collection } from "firebase/firestore"; // 보류
import { getGuestbooks } from "../lib/guestbook";
import { getDiscussions } from "../lib/discussion";
import { db } from "../lib/firebase";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
getCountFromServer(collection(db, "guestbook")).then((snapshot) => console.log(snapshot.data().count));
export default function Home() {
    const [guestbooks, setGuestbooks] = useState<any[]>([]);
    const [guestbooksCount, setGuestbooksCount] = useState<number>(0);
    const [discussions, setDiscussions] = useState<any[]>([]);
    const [discussionsCount, setDiscussionsCount] = useState<number>(0);
    useEffect(() => {
        getCountFromServer(collection(db, "guestbook")).then((snapshot) => setGuestbooksCount(snapshot.data().count));
        getGuestbooks(10).then((guestbooks) => setGuestbooks(guestbooks));
        getCountFromServer(collection(db, "discussion")).then((snapshot) => setDiscussionsCount(snapshot.data().count));
        getDiscussions(10).then((discussions) => setDiscussions(discussions));
    }, []);
    // console.log(guestbooks);
    return (
    <main className="min-h-[calc(100vh-64px)] flex flex-col gap-6 mx-auto max-w-6xl">
      <div className=" px-4 sm:px-6 py-8">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Dashboard</h1>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white/5 rounded-xl p-4">
            <h2 className="text-white font-semibold mb-2">방명록</h2>
            <p className="text-white/70 text-sm">{guestbooksCount}개</p>
          </div>    
          <div className="bg-white/5 rounded-xl p-4">
            <h2 className="text-white font-semibold mb-2">토론</h2>
            <p className="text-white/70 text-sm">{discussionsCount}개</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <h2 className="text-white font-semibold mb-2">토론</h2>
            <p className="text-white/70 text-sm">{guestbooksCount}개</p>
          </div>
        </div>
      </div>
      <div className="px-4 sm:px-6 py-8">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">토론</h2>
        <div className="mt-6 grid grid-cols-1 gap-6">
        {discussions.map((discussion: any) => (
          <Link
            key={discussion.id}
            href={`/discussion/${discussion.id}`}
            className="group relative rounded-xl border border-white/10 bg-white/[0.04] p-4 sm:p-5 overflow-hidden transition hover:border-white/20 hover:bg-white/[0.06]"
          >
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition" aria-hidden>
              <div className="absolute -inset-1 bg-gradient-to-r from-sky-500/20 via-fuchsia-500/10 to-amber-400/20 blur-2xl" />
            </div>

            <div className="flex items-start justify-between gap-3">
              <h3 className="text-white font-semibold text-base sm:text-lg line-clamp-1">{discussion.title}</h3>
            </div>

            <p className="mt-2 text-white/70 text-sm line-clamp-2">{discussion.content}</p>

            <div className="mt-3 flex items-center justify-between text-xs text-white/50">
              <div className="flex items-center gap-2">
                <Image src={discussion.authorPhoto || ""} alt={discussion.authorName || "익명"} width={32} height={32} className="rounded-full" />
                <span className="font-medium text-white/70">{discussion.authorName || "익명"}</span>
              </div>
              <time className="tabular-nums">
                {discussion.createdAt?.toDate ? discussion.createdAt.toDate().toLocaleString() : ""}
              </time>
            </div>
          </Link>
        ))}
        </div>
      </div>
      <div className="px-4 sm:px-6 py-8">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">최근 방명록</h2>
        <div className="mt-6 grid grid-cols-1 gap-6">
        {guestbooks.map((guestbook: any) => (
          <div key={guestbook.id} className="bg-white/5 gap-2 flex flex-col rounded-xl p-4">
            <h1 className="text-white font-semibold mb-2">{guestbook.username}</h1>
            <p className="text-white/70 text-sm">{guestbook.message}</p>
            <p className="text-white/70 text-sm">{guestbook.createdAt}</p>
          </div>
        ))}
        </div>
      </div>
    </main>
  );
}
