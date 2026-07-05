import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import Navbar from "../components/Navbar";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

function MyReports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const q = query(
          collection(db, "reports"),
          where("createdBy", "==", auth.currentUser.uid)
        );

        const querySnapshot = await getDocs(q);

        const reportList = [];

        querySnapshot.forEach((doc) => {
          reportList.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        setReports(reportList);
      } catch (error) {
        console.log(error);
      }
    };

    fetchReports();
  }, []);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 py-10 px-6">

        <h1 className="text-4xl font-bold text-center text-blue-600 mb-10">
          My Reports
        </h1>

        {reports.length === 0 ? (
          <div className="text-center text-gray-500 text-lg">
            You haven't reported any issues yet.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {reports.map((report) => (

              <div
                key={report.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >

                {report.imageUrl && (
                  <img
                    src={report.imageUrl}
                    alt="Issue"
                    className="w-full h-56 object-cover"
                  />
                )}

                <div className="p-6">

                  <h2 className="text-2xl font-bold mb-3">
                    {report.title}
                  </h2>

                  <p className="text-gray-600 mb-4">
                    {report.description}
                  </p>

                  <p>
                    <b>Category:</b> {report.category}
                  </p>

                  <p>
                    <b>Priority:</b>{" "}
                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm ${
                        report.priority === "High"
                          ? "bg-red-500"
                          : report.priority === "Medium"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                    >
                      {report.priority}
                    </span>
                  </p>

                  <p className="mt-3">
                    <b>Status:</b>{" "}
                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm ${
                        report.status === "Resolved"
                          ? "bg-green-600"
                          : report.status === "In Progress"
                          ? "bg-blue-600"
                          : "bg-yellow-500"
                      }`}
                    >
                      {report.status}
                    </span>
                  </p>

                  <p className="mt-3 text-lg font-semibold">
                    👍 {report.upvotes || 0} Community Supports
                  </p>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>
    </>
  );
}

export default MyReports;