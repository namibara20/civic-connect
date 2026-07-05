import { useState } from "react";
import Navbar from "../components/Navbar";
import { improveComplaint } from "../services/aiservice";
import { uploadImage } from "../services/uploadService";
import { createReport } from "../services/reportservice";
import LocationPicker from "../components/LocationPicker";

function ReportIssue() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);

  // Handle image selection
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Improve description using AI
  const improveDescription = async () => {
    if (!description.trim()) {
      alert("Please enter a description first.");
      return;
    }

    try {
      const aiResult = await improveComplaint(description);

      setDescription(aiResult.improvedText);
      setCategory(aiResult.category);
      setPriority(aiResult.priority);
    } catch (error) {
      console.error(error);
      alert("AI failed.");
    }
  };



  // Submit report
  const handleSubmit = async () => {
    try {
      let imageUrl = "";

      if (image) {
        const uploadedImage = await uploadImage(image);
        imageUrl = uploadedImage.url;
      }

      await createReport({
        title,
        description,
        category,
        priority,
        imageUrl,
        location,
      });

      alert("Issue Submitted!");

      setTitle("");
      setDescription("");
      setCategory("");
      setPriority("");
      setImage(null);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-200 py-10 px-10 max-w-7xl mx-auto">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">

          <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
            Report a Civic Issue
          </h1>

          <div className="space-y-5">

            <input
              type="text"
              placeholder="Issue Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <textarea
              rows="5"
              placeholder="Describe the issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <div>
                <label className="block text-lg font-semibold mb-2">
                    📍 Select Location
                </label>

                <LocationPicker
                    onLocationSelect={setLocation}
                />
                </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border rounded-lg p-3"
            >
              <option value="">Select Category</option>
              <option>Road</option>
              <option>Garbage</option>
              <option>Water</option>
              <option>Electricity</option>
            </select>

            <input
              type="text"
              value={priority}
              readOnly
              placeholder="AI Predicted Priority"
              className="w-full border rounded-lg p-3 bg-gray-100"
            />

            <input
              type="file"
              onChange={handleImageChange}
              className="w-full border rounded-lg p-3"
            />

            <button
              onClick={improveDescription}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition"
            >
              🤖 Improve Description with AI
            </button>

            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
            >
              Submit Complaint
            </button>

          </div>

        </div>
      </div>
    </>
  );
}

export default ReportIssue;