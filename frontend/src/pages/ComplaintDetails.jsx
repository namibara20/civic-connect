import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { auth, db } from "../firebase";
import {
  addComment,
  deleteComment,
} from "../services/commentService";

import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";

function ComplaintDetails() {
  const { id } = useParams();

  const [report, setReport] = useState(null);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
  fetchReport();
  fetchComments();
}, []);

  const fetchReport = async () => {
    try {
      const docRef = doc(db, "reports", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setReport(docSnap.data());
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchComments = async () => {
  try {
    const q = query(
  collection(db, "comments"),
  where("complaintId", "==", id),
  orderBy("createdAt", "desc")
);

    const querySnapshot = await getDocs(q);

    const commentList = [];

    querySnapshot.forEach((doc) => {
      commentList.push({
        id: doc.id,
        ...doc.data(),
      });
    });




    setComments(commentList);
  } catch (error) {
    console.log(error);
  }
};

    const handleComment = async () => {
  if (!newComment.trim()) {
    return;
  }

  try {
    await addComment(id, newComment);

    setNewComment("");

    fetchComments();
  } catch (error) {
    console.log(error);
  }
};

const handleDeleteComment = async (commentId) => {
  try {
    await deleteComment(commentId);
    fetchComments();
  } catch (error) {
    console.log(error);
  }
};

  if (!report) {
    return (
      <>
        <Navbar />
        <div className="text-center mt-20 text-2xl">
          Loading...
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto py-10 px-6">

        {report.imageUrl && (
          <img
            src={report.imageUrl}
            alt="Issue"
            className="w-full h-96 object-cover rounded-2xl shadow-lg"
          />
        )}

        <h1 className="text-4xl font-bold mt-8">
          {report.title}
        </h1>

        <p className="text-gray-600 mt-4">
          {report.description}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">

          <span className="bg-gray-200 px-4 py-2 rounded-full">
            📂 {report.category}
          </span>

          <span className="bg-red-500 text-white px-4 py-2 rounded-full">
            {report.priority}
          </span>

          <span className="bg-yellow-500 text-white px-4 py-2 rounded-full">
            {report.status}
          </span>

        </div>

        <div className="mt-8 text-lg">
          👍 {report.upvotes} Supports
        </div>

        {report.location?.address && (
          <div className="mt-6">
            <h2 className="font-bold text-xl">
              📍 Location
            </h2>

            <p className="text-gray-700 mt-2">
              {report.location.address}
            </p>
          </div>
        )}

        <hr className="my-10" />

<h2 className="text-3xl font-bold mb-6">
  💬 Comments
</h2>

<div className="space-y-4">

  {comments.length === 0 ? (
    <p className="text-gray-500">
      No comments yet.
    </p>
  ) : (
    comments.map((comment) => (
      <div
        key={comment.id}
        className="bg-gray-100 rounded-xl p-4"
      >
        <div className="flex justify-between items-center">

  <div className="flex justify-between items-center">

  <p className="font-semibold">
    {comment.userEmail}
  </p>

  {comment.userId === auth.currentUser.uid && (
    <button
      onClick={() => handleDeleteComment(comment.id)}
      className="text-red-500 hover:text-red-700"
    >
      🗑️
    </button>
  )}

</div>

  <span className="text-sm text-gray-500">
    {comment.createdAt?.toDate().toLocaleString()}
  </span>

</div>

        <p className="mt-2">
          {comment.text}
        </p>
      </div>
    ))
  )}

</div>

<div className="mt-8">

  <textarea
    rows="3"
    placeholder="Write a comment..."
    value={newComment}
    onChange={(e) => setNewComment(e.target.value)}
    className="w-full border rounded-xl p-4"
  />

  <button
    onClick={handleComment}
    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
  >
    Post Comment
  </button>

</div>

      </div>
    </>
  );
}

export default ComplaintDetails;