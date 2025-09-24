import { addDoc, collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "./firebase";


export const createGuestbook = async (guestbook: any) => {
    try {
        const docRef = await addDoc(collection(db, "guestbook"), guestbook);
        console.log("Document successfully written with ID: ", docRef.id);
    } catch (error) {
        console.error("Error writing document: ", error);
    }
}
export const getGuestbooks = async (lm: number) => {
    const querySnapshot = await getDocs(query(collection(db, "guestbook"), orderBy("createdAt", "desc"), limit(lm)));
    const guestbooks: any[] = [];
    querySnapshot.forEach((doc) => {
        guestbooks.push({ id: doc.id, ...doc.data() });
    });
    console.log(querySnapshot);
    return guestbooks;
}