import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReportIssue from "./pages/ReportIssue";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./auth/Signup";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import IssueDetails from "./pages/IssueDetails";
import AdminDashboard from "./pages/AdminDashboard";
import Analytics from "./pages/Analytics";
import MyReports from "./pages/MyReports";
import MapView from "./pages/MapView";
import ComplaintDetails from "./pages/ComplaintDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/myreports" element={<MyReports />} />
        <Route path="/map" element={<MapView />} />

        <Route
      path="/complaint/:id"
      element={<ComplaintDetails />}
    />
        <Route
    path="/dashboard"
    element={
        <ProtectedRoute>
            <Dashboard />
        </ProtectedRoute>
    }
/>


<Route path="/issue/:id" element={<IssueDetails />} />

<Route
  path="/admin"
  element={
    <ProtectedRoute adminOnly={true}>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>


        <Route path="/report" element={<ReportIssue />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;