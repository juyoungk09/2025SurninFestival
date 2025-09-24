import { getDocs, getDoc, doc } from "firebase/firestore";
import { db } from "./firebase";
import { query, collection, orderBy, limit } from "firebase/firestore";

export const getDiscussions = async (lm: number) => {
    const querySnapshot = await getDocs(query(collection(db, "discussion"), orderBy("createdAt", "desc"), limit(lm)));
    const discussions: any[] = [];
    querySnapshot.forEach((doc) => {
        discussions.push({ id: doc.id, ...doc.data() });
    });
    console.log(querySnapshot);
    return discussions;
}

export const getDiscussionById = async (id: string) => {
    const docRef = doc(db, "discussion", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
    } else {
        return null;
    }
}