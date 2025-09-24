"use client";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getDiscussionById, getComments, deleteDiscussion, createComment } from "../../../lib/discussion";
import Image from "next/image";
import { useUser } from "../../../lib/context";
export default function DiscussionDetailPage() {
    const { id } = useParams();
    const [discussion, setDiscussion] = useState<any>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const endRef = useRef<HTMLDivElement | null>(null);
    const user = useUser();
    useEffect(() => {
        if (!id) return;
        getDiscussionById(id as string).then((discussion) => { setDiscussion(discussion), console.log(discussion) });
        getComments(id as string, (comments) => { setComments(comments), console.log(comments) });
    }, [id]);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [comments]);

    const onSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id || !message.trim()) return;
        try {
            setSending(true);
            const payload = {
                discussionId: String(id),
                userId: user?.uid || "",
                username: user?.displayName || "익명",
                authorPhoto: user?.photoURL || "",
                message: message.trim(),
                createdAt: new Date(),
            };
            await createComment(payload);
            setMessage("");
            // const refreshed = await getComments(String(id), (comments) => { setComments(comments), console.log(comments) });
            // setComments(refreshed);
        } catch (err) {
            console.error("failed to send comment", err);
        } finally {
            setSending(false);
        }
    };
    return (
        <main className="min-h-[calc(100vh-64px)] flex flex-col gap-6 mx-auto max-w-6xl">
            {discussion && (
                <div className="px-4 sm:px-6 py-8 flex flex-col gap-6">
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{discussion.title}</h1>
                    {discussion.authorId === user?.uid && <button onClick={() => deleteDiscussion(id as string)} className="px-4 py-2 rounded-lg border border-sky-500/30 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 hover:border-sky-500/50 transition-colors text-sm">삭제하기</button>}
                    <p className="mt-2 text-white/70 text-sm line-clamp-2 bg-white/5 rounded-xl p-4">{discussion.content}</p>
                    <div className="mt-3 flex items-center justify-between text-xs text-white/50">
                        <div className="flex items-center gap-2">
                            Created by
                            <div className="flex items-center gap-2">
                                <Image src={discussion.authorPhoto || ""} alt={discussion.authorName || "익명"} width={32} height={32} className="rounded-full" />
                                <span className="font-medium text-white/70">{discussion.authorName || "익명"}</span>
                            </div>
                        </div>
                        <time className="tabular-nums">
                            {discussion.createdAt ? discussion.createdAt.toDate().toLocaleString() : ""}
                        </time>
                    </div>
                    <div className="mt-6">
                        <h2 className="text-3xl max-h-[100px] md:text-4xl font-extrabold tracking-tight">Comments</h2>
                        <div className="mt-6 max-h-[calc(100vh-200px)] overflow-y-auto webkit-scrollbar scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 space-y-3">
                            {comments.map((comment: any) => {
                                const isMine = (user?.uid && comment.userId === user.uid) || (user?.displayName && comment.username === user.displayName);
                                const timeStr = comment.createdAt ? (comment.createdAt.toDate ? comment.createdAt.toDate().toLocaleString() : new Date(comment.createdAt).toLocaleString()) : "";
                                return (
                                    <div key={comment.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                                        <div className={`max-w-[75%] flex items-end gap-2 ${isMine ? "flex-row-reverse" : "flex-row"}`}>
                                            <Image
                                                src={comment.authorPhoto || "/avatar.png"}
                                                alt={comment.username || "익명"}
                                                width={32}
                                                height={32}
                                                className="rounded-full"
                                            />
                                            <div className="min-w-0">
                                                {!isMine && (
                                                    <div className="text-xs text-white/60 mb-1 truncate max-w-[200px]">{comment.username || "익명"}</div>
                                                )}
                                                <div className={`rounded-2xl border px-3 py-2 text-sm whitespace-pre-wrap break-words ${
                                                    isMine
                                                        ? "bg-sky-500/20 border-sky-500/30 text-white"
                                                        : "bg-white/10 border-white/10 text-white"
                                                }`}>
                                                    {comment.message}
                                                </div>
                                                <div className={`mt-1 text-[11px] text-white/50 ${isMine ? "text-right" : "text-left"}`}>
                                                    {timeStr}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={endRef} />
                        </div>
                        {/* Chat input */}
                        <form onSubmit={onSend} className="mt-4 sticky bottom-0 flex items-center gap-2 bg-transparent">
                            <Image
                                src={user?.photoURL || "/avatar.png"}
                                alt={user?.displayName || "익명"}
                                width={32}
                                height={32}
                                className="rounded-full"
                            />
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="메시지를 입력하세요"
                                className="flex-1 rounded-lg bg-white/10 border border-white/10 px-3 py-2 outline-none focus:border-sky-400/40"
                                maxLength={500}
                            />
                            <button
                                type="submit"
                                disabled={sending || !message.trim()}
                                className="px-4 py-2 rounded-lg border border-sky-500/30 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 hover:border-sky-500/50 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                보내기
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}