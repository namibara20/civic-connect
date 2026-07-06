import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { auth, db } from "../firebase";
import Masonry from "react-masonry-css";
import { useNavigate } from "react-router-dom";
import TrendingComplaints from "../components/TrendingComplaints";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
  arrayUnion,
} from "firebase/firestore";

function Dashboard() {
  const [reports, setReports] = useState([]);

  const [search, setSearch] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("All");

  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const q = query(
        collection(db, "reports"),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);

      const reportList = [];

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();

        // Don't show resolved complaints
        if (data.status !== "Resolved") {
          reportList.push({
            id: docSnap.id,
            ...data,
          });
        }
      });

      setReports(reportList);
    } catch (error) {
      console.log(error);
    }
  };

        const handleUpvote = async (report) => {
        try {
            // Don't allow supporting your own complaint
            if (report.createdBy === auth.currentUser.uid) {
            alert("You can't support your own complaint.");
            return;
            }

            // Already supported?
            if ((report.votedBy || []).includes(auth.currentUser.uid)) {
            alert("You have already supported this complaint.");
            return;
            }

            const reportRef = doc(db, "reports", report.id);

            await updateDoc(reportRef, {
            upvotes: (report.upvotes || 0) + 1,
            votedBy: arrayUnion(auth.currentUser.uid),
            });

            setReports((prevReports) =>
            prevReports.map((r) =>
                r.id === report.id
                ? {
                    ...r,
                    upvotes: (r.upvotes || 0) + 1,
                    votedBy: [...(r.votedBy || []), auth.currentUser.uid],
                    }
                : r
            )
            );
        } catch (error) {
            console.log(error);
        }
        };


        const filteredReports = reports.filter((report) => {

        const matchesSearch =
            report.title
            .toLowerCase()
            .includes(search.toLowerCase()) ||

            report.description
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchesCategory =
            selectedCategory === "All" ||

            report.category === selectedCategory;

        return matchesSearch && matchesCategory;

        });


  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-200 py-10 px-10 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 rounded-3xl text-white p-10 mb-10 shadow-xl">

  <h1 className="text-3xl md:text-5xl font-extrabold mb-4 break-words">
    🏙 CivicConnect
  </h1>

  <p className="text-xl text-blue-100 max-w-3xl">
    Report civic issues, support your community, and help local authorities
    prioritize the problems that matter most.
  </p>

  <div className="flex gap-4 mt-8">

    <button
      onClick={() => navigate("/report")}
      className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:scale-105 transition"
    >
      ➕ Report an Issue
    </button>

    <button
      onClick={() =>
        document
          .getElementById("community-feed")
          ?.scrollIntoView({ behavior: "smooth" })
      }
      className="border border-white px-6 py-3 rounded-xl font-bold hover:bg-white hover:text-blue-600 transition"
    >
      🔥 Explore Feed
    </button>

  </div>

</div>

<TrendingComplaints />

<h2
  id="community-feed"
  className="text-4xl font-bold text-center text-slate-800 mb-3"
>
  Community Feed
</h2>

<p className="text-center text-gray-600 mb-8">
  See civic issues reported by your community and support the ones that matter.
</p>

<div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4 mb-10">

  <input
    type="text"
    placeholder="🔍 Search complaints..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="flex-1 p-3 rounded-xl border shadow-sm"
  />

  <select
    value={selectedCategory}
    onChange={(e) => setSelectedCategory(e.target.value)}
    className="p-3 rounded-xl border shadow-sm"
  >
    <option>All</option>
    <option>Road</option>
    <option>Garbage</option>
    <option>Water</option>
    <option>Electricity</option>
  </select>

</div>

        {reports.length === 0 ? (
          <div className="text-center text-gray-500 text-lg">
            No active complaints found.
          </div>
        ) : (
          
            <Masonry
            breakpointCols={{
                default: 3,
                1100: 2,
                700: 1,
            }}
            className="flex -ml-8 w-auto"
            columnClassName="pl-8 bg-clip-padding"
            >

            {filteredReports.map((report) => (

              <div
                key={report.id}
                className={`rounded-3xl shadow-xl overflow-hidden hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 mb-8 break-inside-avoid border ${
                report.category === "Garbage"
                    ? "bg-green-50 border-green-200"
                    : report.category === "Road"
                    ? "bg-orange-50 border-orange-200"
                    : report.category === "Water"
                    ? "bg-sky-50 border-sky-200"
                    : "bg-yellow-50 border-yellow-200"
                }`}
              >

                {report.imageUrl && (
                  <img
                    src={report.imageUrl}
                    alt="Issue"
                    className="w-full h-56 object-cover"
                  />
                )}

                <div className="p-6">

                  <h2 className="text-2xl font-bold mb-2">
                    {report.title}
                  </h2>

                  <p className="text-gray-600 mb-4">
                    {report.description}
                  </p>

                  {report.createdByName && (
                    <p className="text-sm text-gray-500 mb-3">
                        Reported by{" "}
                        <span className="font-semibold">
                            {report.createdByEmail}
                        </span>
                        </p>
                  )}

                  <div className="space-y-3">

                    

                   <div className="flex flex-wrap gap-2 mt-4">

                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                        📂 {report.category}
                    </span>

                    <span className="font-semibold text-gray-700 self-center">
                        Priority:
                    </span>

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

                    </div>

                                        <div className="flex justify-between items-center mt-5">

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

                                <span className="font-bold text-blue-600">
                                    👍 {report.upvotes || 0}
                                </span>

                                </div>

                                    </div>

                                    {report.createdBy === auth.currentUser.uid ? (

                    <button
                        disabled
                        className="mt-6 w-full bg-gray-400 text-white py-3 rounded-xl cursor-not-allowed"
                    >
                        ✓ Your Complaint
                    </button>

                    ) : (report.votedBy || []).includes(auth.currentUser.uid) ? (

                    <button
                        disabled
                        className="mt-6 w-full bg-green-600 text-white py-3 rounded-xl cursor-not-allowed"
                    >
                        ✓ Already Supported
                    </button>

                    ) : (

                    <button
                        onClick={() => handleUpvote(report)}
                        className="mt-6 w-full bg-blue-100 hover:bg-blue-200 text-blue-700 py-3 rounded-xl transition font-semibold"
                    >
                        ❤️ Support
                    </button>

                    )}

                    <button
                        onClick={() => navigate(`/complaint/${report.id}`)}
                        className="mt-3 w-full border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white py-3 rounded-xl transition"
                    >
                        View Details
                    </button>

                </div>

              </div>

            ))}

          
          </Masonry>
        )}

      </div>
    </>
  );
}

export default Dashboard;