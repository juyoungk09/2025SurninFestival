"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getDiscussions } from "@/lib/discussion";

type Discussion = {
  id: string;
  title: string;
  content: string;
  authorName?: string;
  authorPhoto?: string;
  createdAt?: any;
};

export default function SunrinFestival1() {
  const [items, setItems] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getDiscussions(60);
        setItems(data as Discussion[]);
      } catch (e) {
        console.error(e);
        setError("토론 목록을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const formatDate = (d: any) => {
    if (!d) return "";
    const date = d?.toDate ? d.toDate() : new Date(d);
    return date.toLocaleString();
  };

  return (
    <main className="min-h-[calc(100vh-64px)] flex flex-col gap-6 mx-auto max-w-6xl">
      <div className="px-4 sm:px-6 py-8 space-between">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">토론</h1>
          <Link
            href="/discussion/add"
            className="px-4 py-2 rounded-lg border border-sky-500/30 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 hover:border-sky-500/50 transition-colors text-sm"
          >
            토론 만들기
          </Link>
        </div>

        {loading && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-white/[0.03] p-5 animate-pulse">
                <div className="h-5 w-2/3 bg-white/10 rounded mb-3" />
                <div className="h-3 w-full bg-white/10 rounded mb-2" />
                <div className="h-3 w-11/12 bg-white/10 rounded mb-4" />
                <div className="h-4 w-1/2 bg-white/10 rounded" />
              </div>
            ))}
          </div>
        )}

        {error && !loading && (
          <div className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
            {error}
          </div>
        )}  

        {!loading && !error && items.length === 0 && (
          <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.03] p-6 text-center text-white/60">
            등록된 토론이 없습니다. 상단의 "토론 만들기" 버튼을 눌러 시작해보세요.
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((d) => (
              <Link
                key={d.id}
                href={`/discussion/${d.id}`}
                className="group rounded-xl border border-white/10 bg-white/[0.03] p-5 hover:bg-white/[0.05] transition-colors block"
              >
                <h3 className="font-semibold text-lg text-white/90 line-clamp-1">{d.title}</h3>
                <p className="mt-2 text-sm text-white/70 line-clamp-2 min-h-[2.75rem]">{d.content}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-white/50">
                  <div className="flex items-center gap-2 min-w-0">
                    <Image
                      src={d.authorPhoto || "/avatar.png"}
                      alt={d.authorName || "익명"}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <span className="truncate">{d.authorName || "익명"}</span>
                  </div>
                  <time className="tabular-nums">{formatDate(d.createdAt)}</time>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}