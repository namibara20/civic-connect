import { db, auth } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { deleteDoc, doc } from "firebase/firestore";

export const addComment = async (complaintId, text) => {
  await addDoc(collection(db, "comments"), {
    complaintId,
    text,
    userId: auth.currentUser.uid,
    userEmail: auth.currentUser.email,
    createdAt: serverTimestamp(),
  });
};

export const deleteComment = async (commentId) => {
  await deleteDoc(doc(db, "comments", commentId));
};