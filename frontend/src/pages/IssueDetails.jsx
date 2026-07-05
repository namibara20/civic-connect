import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

function IssueDetails() {

    const { id } = useParams();
    const [report, setReport] = useState(null);

    useEffect(() => {
  const fetchReport = async () => {
    try {
      const docRef = doc(db, "reports", id);

      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setReport(docSnap.data());
      } else {
        console.log("No such report!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  fetchReport();
}, [id]);


if (!report) {
  return <h2>Loading...</h2>;
}
   return (
  <div>
    <h1>Issue Details</h1>

    <h2>{report.title}</h2>

    {report.imageUrl && (
      <img
        src={report.imageUrl}
        alt="Issue"
        style={{
          width: "400px",
          borderRadius: "10px",
        }}
      />
    )}

    <p>
      <b>Description:</b> {report.description}
    </p>

    <p>
      <b>Category:</b> {report.category}
    </p>

    <p>
      <b>Status:</b> {report.status}
    </p>

    <p>
      👍 {report.upvotes}
    </p>
  </div>
);
}

export default IssueDetails;