import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
];

function Analytics() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    progress: 0,
    resolved: 0,
    supports: 0,
  });

  const [categoryData, setCategoryData] = useState([]);
  const [priorityData, setPriorityData] = useState([]);
  const [cityData, setCityData] = useState([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const snapshot = await getDocs(collection(db, "reports"));

      let total = 0;
      let pending = 0;
      let progress = 0;
      let resolved = 0;
      let supports = 0;

      const categories = {};
      const priorities = {
        High: 0,
        Medium: 0,
        Low: 0,
      };

      const cities = {};

      snapshot.forEach((doc) => {
        const report = doc.data();

        total++;

        supports += report.upvotes || 0;

        if (report.status === "Pending") pending++;
        else if (report.status === "In Progress") progress++;
        else if (report.status === "Resolved") resolved++;

        categories[report.category] =
          (categories[report.category] || 0) + 1;

        if (report.priority)
          priorities[report.priority] =
            (priorities[report.priority] || 0) + 1;

        // Extract city from address
        if (report.location?.address) {
          const parts = report.location.address.split(",");

          let city = "Unknown";

          if (parts.length >= 4) {
            city = parts[parts.length - 4].trim();
          }

          cities[city] = (cities[city] || 0) + 1;
        }
      });

      setStats({
        total,
        pending,
        progress,
        resolved,
        supports,
      });

      setCategoryData(
        Object.keys(categories).map((key) => ({
          name: key,
          value: categories[key],
        }))
      );

      setPriorityData([
        { name: "High", count: priorities.High },
        { name: "Medium", count: priorities.Medium },
        { name: "Low", count: priorities.Low },
      ]);

      setCityData(
        Object.keys(cities).map((key) => ({
          city: key,
          complaints: cities[key],
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  const statusData = [
    { name: "Pending", count: stats.pending },
    { name: "In Progress", count: stats.progress },
    { name: "Resolved", count: stats.resolved },
  ];

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-200 py-10 px-10 max-w-7xl mx-auto">

        <h1 className="text-4xl font-bold text-center text-blue-700 mb-10">
          📊 Analytics Dashboard
        </h1>

        {/* Statistic Cards */}

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-10">

          <div className="bg-blue-100 rounded-2xl shadow-lg p-6 text-center">
            <h2 className="text-4xl font-bold">{stats.total}</h2>
            <p>Total Reports</p>
          </div>

          <div className="bg-yellow-100 rounded-2xl shadow-lg p-6 text-center">
            <h2 className="text-4xl font-bold">{stats.pending}</h2>
            <p>Pending</p>
          </div>

          <div className="bg-cyan-100 rounded-2xl shadow-lg p-6 text-center">
            <h2 className="text-4xl font-bold">{stats.progress}</h2>
            <p>In Progress</p>
          </div>

          <div className="bg-green-100 rounded-2xl shadow-lg p-6 text-center">
            <h2 className="text-4xl font-bold">{stats.resolved}</h2>
            <p>Resolved</p>
          </div>

          <div className="bg-pink-100 rounded-2xl shadow-lg p-6 text-center">
            <h2 className="text-4xl font-bold">{stats.supports}</h2>
            <p>Total Supports</p>
          </div>

        </div>

        {/* Charts */}

        <div className="grid md:grid-cols-2 gap-8">

          <div className="bg-white rounded-2xl shadow-lg p-6">

            <h2 className="text-xl font-bold mb-5 text-center">
              Complaints by Category
            </h2>

            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={120}
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>

          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">

            <h2 className="text-xl font-bold mb-5 text-center">
              Complaint Status
            </h2>

            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" radius={[8,8,0,0]} />
              </BarChart>
            </ResponsiveContainer>

          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">

            <h2 className="text-xl font-bold mb-5 text-center">
              Priority Distribution
            </h2>

            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#EF4444" radius={[8,8,0,0]} />
              </BarChart>
            </ResponsiveContainer>

          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">

            <h2 className="text-xl font-bold mb-5 text-center">
              Complaints by City
            </h2>

            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={cityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="city" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="complaints"
                  fill="#10B981"
                  radius={[8,8,0,0]}
                />
              </BarChart>
            </ResponsiveContainer>

          </div>

        </div>

      </div>
    </>
  );
}

export default Analytics;