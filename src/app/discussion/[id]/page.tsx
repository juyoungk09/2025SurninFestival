"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getDiscussionById, getComments, deleteDiscussion } from "../../../lib/discussion";
import Image from "next/image";
import { useUser } from "../../../lib/context";
export default function DiscussionDetailPage() {
    const { id } = useParams();
    const [discussion, setDiscussion] = useState<any>(null);
    const [comments, setComments] = useState<any>(null);
    const user = useUser();
    useEffect(() => {
        if (!id) return;
        getDiscussionById(id as string).then((discussion) => { setDiscussion(discussion), console.log(discussion) });
        getComments(id as string).then((comments) => { setComments(comments), console.log(comments) });
    }, [id]);
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
                        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Comments</h2>
                        <div className="mt-6 grid grid-cols-1 gap-6">
                            {comments.map((comment: any) => (
                                <div key={comment.id} className="bg-white/5 gap-2 flex flex-col rounded-xl p-4">
                                    <h1 className="text-white font-semibold mb-2">{comment.username}</h1>
                                    <p className="text-white/70 text-sm">{comment.message}</p>
                                    <p className="text-white/70 text-sm">{comment.createdAt ? comment.createdAt.toDate().toLocaleString() : ""}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}