import { getDocs, getDoc, doc, addDoc, deleteDoc, updateDoc } from "firebase/firestore";
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


export const createDiscussion = async (discussion: any): Promise<string | null> => {
    try {
        const docRef = await addDoc(collection(db, "discussion"), discussion);
        return docRef.id;
    } catch (error) {
        console.error("Error writing document: ", error);
        return null;
    }
}

export const getComments = async (discussionId: string) => {
    const querySnapshot = await getDocs(query(collection(db, "discussion", discussionId, "comment")));
    const comments: any[] = [];
    querySnapshot.forEach((doc) => {
        comments.push({ id: doc.id, ...doc.data() });
    });
    console.log(querySnapshot);
    return comments;
}

export const createComment = async (comment: any) => {
    try {
        const docRef = await addDoc(collection(db, "discussion", comment.discussionId, "comment"), comment);
    } catch (error) {
        console.error("Error writing document: ", error);
    }
}

export const updateDiscussion = async (id: string, discussion: any) => {
    try {
        const docRef = doc(db, "discussion", id);
        await updateDoc(docRef, discussion);
    } catch (error) {
        console.error("Error updating document: ", error);
    }
}

export const updateComment = async (id: string, comment: any) => {
    try {
        const docRef = doc(db, "discussion", comment.discussionId, "comment", id);
        await updateDoc(docRef, comment);
    } catch (error) {
        console.error("Error updating document: ", error);
    }
}
export const deleteDiscussion = async (id   : string) => {
    try {
        const docRef = doc(db, "discussion", id);
        await deleteDoc(docRef);
    } catch (error) {
        console.error("Error deleting document: ", error);
    }
}