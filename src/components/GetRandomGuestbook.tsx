"use client";

import { useEffect, useMemo, useState } from "react";
import { getGuestbooks } from "../lib/guestbook";

export default function GetRandomGuestbook() {
  const [guestbook, setGuestbook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAnim, setShowAnim] = useState(false); // controls fade/slide-in
  const [cardKey, setCardKey] = useState(0); // force re-anim

  const shadowClass = useMemo(() => "shadow-[0_6px_30px_-10px_rgba(56,189,248,0.35)]", []);

  const loadRandomGuestbook = async () => {
    try {
      setLoading(true);
      setShowAnim(false); // reset animation while loading
      const guestbooks = await getGuestbooks(100);

      if (!guestbooks || guestbooks.length === 0) {
        setGuestbook(null);
      } else {
        const randomIndex = Math.floor(Math.random() * guestbooks.length);
        setGuestbook(guestbooks[randomIndex]);
      }

      // small delay to allow DOM to update before animating in
      requestAnimationFrame(() => {
        setCardKey((k) => k + 1);
        setShowAnim(true);
      });
    } catch (err) {
      console.error("Error loading guestbooks: ", err);
      setError("방명록을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRandomGuestbook();
  }, []);

  const formatDate = (date: any) => {
    if (!date) return "";
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Fancy loading skeleton
  if (loading) {
    return (
      <div className={`p-6 bg-black/5 rounded-xl border border-white/10 ${shadowClass}`}>
        <h2 className="text-xl font-bold mb-4">랜덤 방명록</h2>
        <div className="bg-black/20 rounded-lg p-4 animate-pulse">
          <div className="flex justify-between items-start mb-3">
            <div className="h-4 w-24 bg-white/10 rounded" />
            <div className="h-3 w-20 bg-white/10 rounded" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-full bg-white/10 rounded" />
            <div className="h-3 w-11/12 bg-white/10 rounded" />
            <div className="h-3 w-10/12 bg-white/10 rounded" />
          </div>
          <div className="mt-4 h-8 w-36 bg-sky-400/10 rounded" />
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className={`p-6 bg-gray-900 rounded-xl border border-white/10 transition-all duration-500 ${shadowClass} hover:shadow-[0_12px_40px_-10px_rgba(56,189,248,0.5)]`}>
      <h2 className="text-xl font-bold mb-4">랜덤 방명록</h2>

      {!guestbook ? (
        <div
          key={cardKey}
          className={`p-6 text-center text-gray-400 bg-black/20 rounded-lg transition-[opacity,transform] duration-700 ease-out transform-gpu ${
            showAnim ? "opacity-100 translate-y-0 rotate-0" : "opacity-0 translate-y-24 rotate-[360deg]"
          }`}
        >
          아직 방명록이 없습니다. 첫 번째 방명록을 작성해보세요!
        </div>
      ) : (
        <>
          <div
            key={cardKey}
            className={`bg-black p-5 rounded-lg border border-white/5 transition-[opacity,transform] duration-700 ease-out transform-gpu will-change-transform ${
              showAnim ? "opacity-100 translate-y-0 rotate-0" : "opacity-0 translate-y-24 rotate-[360deg]"
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="font-semibold">{guestbook.username || "익명"}</span>
              <span className="text-sm text-gray-400">{formatDate(guestbook.createdAt)}</span>
            </div>
            <p className="whitespace-pre-wrap leading-relaxed text-white/90">{guestbook.message}</p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={loadRandomGuestbook}
              className="mt-4 px-4 py-2 bg-sky-500/10 hover:bg-sky-500/20 text-white rounded-lg text-sm transition-all duration-300 border border-sky-500/20 hover:border-sky-500/40 active:scale-[0.98]"
            >
              다른 방명록 보기
            </button>
          </div>
        </>
      )}
    </div>
  );
}