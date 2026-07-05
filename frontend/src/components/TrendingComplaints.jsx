import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

function TrendingComplaints() {
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    fetchTrending();
  }, []);

  const fetchTrending = async () => {
    try {
      const q = query(
        collection(db, "reports"),
        orderBy("upvotes", "desc"),
        limit(3)
      );

      const querySnapshot = await getDocs(q);

      const list = [];

      querySnapshot.forEach((doc) => {
        list.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setTrending(
  list.filter((report) => (report.upvotes || 0) > 0)
);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-10">

      <h2 className="text-2xl font-bold text-orange-500 mb-5">
        🔥 Trending Complaints
      </h2>

      <div className="space-y-4">

        {trending.map((report, index) => (

          <div
            key={report.id}
            className="flex justify-between items-center border-b pb-3"
          >

            <div>
              <h3 className="font-semibold text-lg">
                {index + 1}. {report.title}
              </h3>

              <p className="text-gray-500">
                {report.category}
              </p>
            </div>

            <div className="font-bold text-blue-600">
                👍 {report.upvotes || 0}
            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default TrendingComplaints;