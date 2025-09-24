import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
export async function signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      };
    } catch (error) {
      console.error("Google login error:", error);
      return null;
    }
}


export async function handleUser(user: any) {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
  
    if (!userSnap.exists()) {
      // 최초 접속
      await setDoc(userRef, {
        displayName: user.displayName,
        photoURL: user.photoURL,
        email: user.email
      });
      console.log("최초 로그인 유저 저장 완료");
    } else {
      console.log("기존 유저");
    }
  }