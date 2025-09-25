"use client";
import AddGuestbook from "@/components/AddGuestbook";
import { useState, useEffect } from "react";
import GetRandomGuestbook from "@/components/GetRandomGuestbook";
import { getGuestbooks } from "@/lib/guestbook";
import Image from "next/image";

export default function SunrinFestival2() {
    const [toShow, setShow] = useState("");
    const [guestbooks, setGuestbooks] = useState<any[]>([]);
    const [view, setView] = useState<"grid" | "chat">("grid");

    useEffect(() => {
        getGuestbooks(1000).then((guestbooks) => setGuestbooks(guestbooks));
    }, []);

    const formatDate = (date: any) => {
        if (!date) return "";
        const d = date.toDate ? date.toDate() : new Date(date);
        return d.toLocaleString();
    };

    return (
        <main className="min-h-[calc(100vh-64px)] flex flex-col gap-6 mx-auto max-w-6xl">
            <div className="px-4 sm:px-6 py-8 space-between">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">방명록 & 랜덤 뽑기</h1>

                <div className="mt-6 bg-white/5 rounded-xl p-4 relative">
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Inform</h2>
                    <p className="mt-2 text-white/70 text-sm line-clamp-2">
                        방명록에 글을 남기고, 뽑기를 통해해 다른 사람의 글을 랜덤으로 확인할 수 있습니다.
                    </p>
                    <div className="mt-6 flex w-full gap-2">
                        <button
                            onClick={() => setShow("add")}
                            aria-pressed={toShow === "add"}
                            className={`px-4 py-2 text-sm flex-1 rounded-lg border transition-colors duration-200
                                ${toShow === "add"
                                    ? "bg-sky-500/20 text-sky-300 border-sky-500/40"
                                    : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white"}
                            `}
                        >
                            글쓰기
                        </button>
                        <button
                            onClick={() => setShow("random")}
                            aria-pressed={toShow === "random"}
                            className={`px-4 py-2 text-sm flex-1 rounded-lg border transition-colors duration-200
                                ${toShow === "random"
                                    ? "bg-violet-500/20 text-violet-300 border-violet-500/40"
                                    : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white"}
                            `}
                        >
                            랜덤 뽑기
                        </button>
                    </div>
                    {toShow && (
                        <div className="fixed inset-0 flex items-center justify-center z-50">
                            <div
                                onClick={() => setShow("")}
                                className="absolute inset-0 bg-black/50"
                            />
                            <div className="relative rounded-xl p-6 z-10 w-[90%] max-w-md shadow-lg">
                                <button
                                    onClick={() => setShow("")}
                                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                                >
                                    ✕
                                </button>
                                {toShow === "add" && <AddGuestbook onClose={() => setShow("")} />}
                                {toShow === "random" && <GetRandomGuestbook />}
                            </div>
                        </div>
                    )}
                </div>
                <div>
                    <div className="mt-6 mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-bold">방명록</h2>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setView("grid")}
                                aria-pressed={view === "grid"}
                                className={`px-3 py-1 rounded-lg border text-sm transition-colors ${view === "grid" ? "bg-white/10 text-white border-white/20" : "bg-transparent text-white/70 border-white/10 hover:bg-white/5 hover:text-white"}`}
                            >
                                그리드 보기
                            </button>
                            <button
                                onClick={() => setView("chat")}
                                aria-pressed={view === "chat"}
                                className={`px-3 py-1 rounded-lg border text-sm transition-colors ${view === "chat" ? "bg-white/10 text-white border-white/20" : "bg-transparent text-white/70 border-white/10 hover:bg-white/5 hover:text-white"}`}
                            >
                                채팅 보기
                            </button>
                        </div>
                    </div>
                    {guestbooks.length === 0 ? (
                        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-center text-white/60">
                            아직 방명록이 없습니다. 첫 글을 남겨보세요!
                        </div>
                    ) : (
                        <>
                            {view === "grid" ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                    {guestbooks.map((guestbook: any) => (
                                        <div
                                            key={guestbook.id}
                                            className="rounded-xl border-2 border-white/20 bg-black/30 p-4 transition-colors hover:bg-black/40"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="h-9 w-9 shrink-0 rounded-full overflow-hidden">
                                                    <Image src={guestbook.authorPhoto || "/guest.png"} className="rounded-full" alt="author" width={36} height={36} />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-white/90 truncate">
                                                        {guestbook.username || "익명"}
                                                    </p>
                                                    <p className="mt-1 text-sm text-white/80 whitespace-pre-wrap break-words">
                                                        {guestbook.message}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="border-2 p-2 border-white/10 space-y-3">
                                    {guestbooks.map((g: any, idx: number) => (
                                        <div key={g.id} className={`flex ${idx % 2 === 0 ? "justify-start" : "justify-end"}`}>
                                            <div className={`max-w-[80%] flex items-center gap-2 ${idx % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
                                                <Image src={g.authorPhoto || "/guest.png"} alt={g.username || "익명"} width={28} height={28} className="rounded-full" />
                                                <div className="min-w-0">
                                                    {idx % 2 === 0 && (
                                                        <div className="text-xs text-white/60 mb-1 truncate max-w-[200px]">{g.username || "익명"}</div>
                                                    )}
                                                    <div className={`rounded-2xl border px-3 py-2 text-sm whitespace-pre-wrap break-words ${idx % 2 === 0 ? "bg-white/10 border-white/10 text-white" : "bg-sky-500/20 border-sky-500/30 text-white"}`}>
                                                        {g.message}
                                                    </div>
                                                    <div className={`mt-1 text-[11px] text-white/50 ${idx % 2 === 0 ? "text-left" : "text-right"}`}>{formatDate(g.createdAt)}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}