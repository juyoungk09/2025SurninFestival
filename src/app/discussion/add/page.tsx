"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { createDiscussion } from "@/lib/discussion";
import { useUser } from "@/lib/context";
import { useState } from "react";

type FormValues = {
  title: string;
  content: string;
};

export default function DiscussionAdd() {
  const router = useRouter();
  const user = useUser();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      setSubmitting(true);
      setError(null);
      const payload = {
        ...data,
        authorId: user?.uid || "",
        authorName: user?.displayName || "익명",
        authorPhoto: user?.photoURL || "",
        createdAt: new Date(),
      };

      const id = await createDiscussion(payload);
      if (!id) throw new Error("Failed to create discussion");
      router.push(`/discussion/${id}`);
    } catch (e: any) {
      console.error(e);
      setError("토론을 생성하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-64px)] flex flex-col gap-6 mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">토론 만들기</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <label htmlFor="title" className="block text-sm text-white/70 mb-2">
            제목
          </label>
          <input
            id="title"
            type="text"
            className="w-full rounded-lg bg-black/30 border border-white/10 p-3 outline-none focus:border-sky-400/40"
            placeholder="토론 주제를 입력하세요 (최대 80자)"
            {...register("title", { required: true, maxLength: 80 })}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-400">제목은 필수이며 80자 이하여야 합니다.</p>
          )}
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <label htmlFor="content" className="block text-sm text-white/70 mb-2">
            내용
          </label>
          <textarea
            id="content"
            rows={8}
            className="w-full resize-none rounded-lg bg-black/30 border border-white/10 p-3 outline-none focus:border-sky-400/40"
            placeholder="토론 내용을 작성하세요 (최대 1000자)"
            {...register("content", { required: true, maxLength: 1000 })}
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-400">내용은 필수이며 1000자 이하여야 합니다.</p>
          )}
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 rounded-lg border border-sky-500/30 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 hover:border-sky-500/50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? "생성 중..." : "토론 생성"}
          </button>
        </div>
      </form>
    </main>
  );
}