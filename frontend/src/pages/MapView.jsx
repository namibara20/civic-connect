import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Marker Icons
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function MapView() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "reports"));

      const reportList = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();

        if (data.location) {
          reportList.push({
            id: doc.id,
            ...data,
          });
        }
      });

      setReports(reportList);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100">

        <h1 className="text-4xl font-bold text-center text-blue-600 py-8">
          Community Complaint Map
        </h1>

        <div className="max-w-7xl mx-auto px-6 pb-10">

          <MapContainer
            center={[12.9716, 77.5946]}
            zoom={12}
            style={{
              height: "700px",
              width: "100%",
              borderRadius: "20px",
            }}
          >
            <TileLayer
              attribution="© OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {reports.map((report) => (
              <Marker
                key={report.id}
                position={[
                  report.location.lat,
                  report.location.lng,
                ]}
              >
                <Popup>

                  <h2 className="font-bold text-lg">
                    {report.title}
                  </h2>

                  <p className="mt-2">
                    {report.description}
                  </p>

                  <hr className="my-2" />

                  <p>
                    <b>Category:</b> {report.category}
                  </p>

                  <p>
                    <b>Status:</b> {report.status}
                  </p>

                  <p>
                    <b>Supports:</b> 👍 {report.upvotes}
                  </p>

                  <p>
                    <b>Reported By:</b>
                    <br />
                    {report.createdByEmail}
                  </p>

                </Popup>
              </Marker>
            ))}

          </MapContainer>

        </div>

      </div>
    </>
  );
}

export default MapView;