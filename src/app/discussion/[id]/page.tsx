"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getDiscussionById } from "../../../lib/discussion";
import Image from "next/image";
export default function DiscussionDetailPage() {
    const { id } = useParams();
    const [discussion, setDiscussion] = useState<any>(null);
    useEffect(() => {
        if (!id) return;
        getDiscussionById(id as string).then((discussion) => setDiscussion(discussion));
    }, [id]);
    return (
        <main className="min-h-[calc(100vh-64px)] flex flex-col gap-6 mx-auto max-w-6xl">
            {discussion && (
                <div className="px-4 sm:px-6 py-8 flex flex-col gap-6">
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{discussion.title}</h1>
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
                            {discussion.createdAt?.toDate ? discussion.createdAt.toDate().toLocaleString() : ""}
                        </time>
                    </div>
                </div>
            )}
        </main>
    );
}