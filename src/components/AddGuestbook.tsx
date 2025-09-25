import { useForm } from "react-hook-form";
import { useUser } from "../lib/context";
import { SubmitHandler } from "react-hook-form";
import { createGuestbook } from "../lib/guestbook";
import { useRouter } from "next/navigation";

export default function AddGuestbook( {onClose}: {onClose: () => void}) {
    const user = useUser();
    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            message: ""
        }
    });
    const onSubmitForm : SubmitHandler<any> = (data: any) => {
        data.createdAt = new Date();
        data.username = user?.displayName || "익명";
        data.authorPhoto = user?.photoURL || "";
        createGuestbook(data);
        onClose();
    }
    return (
        <div className={`bg-gray-900 p-5 rounded-lg border border-white/5 transition-all duration-500 will-change-transform translate-y-0 hover:scale-[1.01]`}>  
        <form onSubmit={handleSubmit(onSubmitForm)}>
           <h2 className="text-xl font-bold mb-4">방명록 작성</h2>
            <div  className="mt-6 flex flex-col gap-2 rounded-xl bg-black p-4">
            <div className="flex flex-col gap-2 rounded-xl">
                <label htmlFor="message">Message</label>
                <textarea className="bg-white/5 rounded-xl resize-none p-2" {...register("message", { required: true })} maxLength={200} placeholder="Message (최대 200자)" />
            </div>
            {errors.message && <p className="text-red-500">Message is required</p>}
            </div>
            <button type="submit" className="mt-2 w-full cursor-pointer border hover:bg-sky-500/20 border-sky-500/20 hover:border-sky-500/40 bg-sky-500/10 rounded-xl p-2">작성하기</button>
        </form>
        </div>
    )
}