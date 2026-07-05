import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import Navbar from "../components/Navbar";

function AdminDashboard() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "reports"));

      const reportList = [];

      querySnapshot.forEach((docSnap) => {
        reportList.push({
          id: docSnap.id,
          ...docSnap.data(),
        });
      });

      setReports(reportList);
    } catch (error) {
      console.log(error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const reportRef = doc(db, "reports", id);

      await updateDoc(reportRef, {
        status: status,
      });

      setReports((prev) =>
        prev.map((report) =>
          report.id === id
            ? { ...report, status: status }
            : report
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const deleteReport = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this complaint?"
    );

    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "reports", id));

      setReports((prev) =>
        prev.filter((report) => report.id !== id)
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
  <>
    <Navbar />

    <div className="min-h-screen bg-gray-100 py-10 px-6">

      <h1 className="text-4xl font-bold text-center text-blue-600 mb-10">
        Admin Dashboard
      </h1>

      {reports.length === 0 ? (

        <p className="text-center text-gray-600">
          No complaints found.
        </p>

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

                <h2 className="text-2xl font-bold">
                  {report.title}
                </h2>

                <p className="text-gray-600 mt-3">
                  {report.description}
                </p>

                <div className="mt-4 space-y-2">

                  <p>
                    <b>Category:</b> {report.category}
                  </p>

                  <p>
                    <b>Priority:</b> {report.priority}
                  </p>

                  <p>
                    <b>Status:</b> {report.status}
                  </p>

                  <p>
                    👍 {report.upvotes}
                  </p>

                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">

                  <button
                    onClick={() =>
                      updateStatus(report.id, "Pending")
                    }
                    className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg"
                  >
                    Pending
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(report.id, "In Progress")
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                  >
                    In Progress
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(report.id, "Resolved")
                    }
                    className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
                  >
                    Resolved
                  </button>

                  <button
                    onClick={() => deleteReport(report.id)}
                    className="bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  </>
);
}

export default AdminDashboard;