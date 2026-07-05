import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../firebase";

export const createReport = async (report) => {
  const user = auth.currentUser;

  await addDoc(collection(db, "reports"), {
    ...report,

    createdBy: user.uid,
    createdByName: user.displayName || "Anonymous",
    createdByEmail: user.email,

    createdAt: new Date(),

    status: "Pending",
    upvotes: 0,
    votedBy: [],
  });
};