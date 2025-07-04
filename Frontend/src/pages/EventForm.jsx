import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createEvent } from "../features/eventSlice";
import { useNavigate } from "react-router-dom";
import { unwrapResult } from "@reduxjs/toolkit";

const EventForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    ticketPrice: "",
    category: "cultural",
    location: "",
    country: "",
  });
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    for (let key in formData) {
      data.append(key, formData[key]);
    }

    if (image) {
      data.append("image", image);
    }
    try {
      const resultAction = await dispatch(createEvent(data));
      unwrapResult(resultAction); // throw if error
      navigate("/events/my"); // ✅ redirect on success
    } catch (err) {
      console.error("Create event failed:", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-6"
    >
      <h2 className="text-2xl font-bold">Create Event</h2>

      <div>
        <label htmlFor="title" className="block font-medium">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="description" className="block font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="date" className="block font-medium">
          Date
        </label>
        <input
          id="date"
          name="date"
          type="date"
          min={new Date().toISOString().split("T")[0]}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="time" className="block font-medium">
          Time
        </label>
        <input
          id="time"
          name="time"
          type="time"
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="venue" className="block font-medium">
          Venue
        </label>
        <input
          id="venue"
          name="venue"
          type="text"
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="ticketPrice" className="block font-medium">
          Ticket Price
        </label>
        <input
          id="ticketPrice"
          name="ticketPrice"
          type="number"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label htmlFor="maxAttendees" className="block font-medium">
          Max Attendeese
        </label>
        <input
          id="maxAttendees"
          name="maxAttendees"
          type="number"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="location" className="block font-medium">
          Location (City/State)
        </label>
        <input
          id="location"
          name="location"
          type="text"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="country" className="block font-medium">
          Country
        </label>
        <input
          id="country"
          name="country"
          type="text"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="category" className="block font-medium">
          Category
        </label>
        <select
          id="category"
          name="category"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="cultural">Cultural</option>
          <option value="food">Food</option>
          <option value="entertainment">Entertainment</option>
          <option value="sports">Sports</option>
          <option value="networking">Networking</option>
          <option value="religious">Religious</option>
        </select>
      </div>

      <div>
        <label htmlFor="image" className="block font-medium">
          Upload Image
        </label>
        <input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
        >
          Create Event
        </button>
      </div>
    </form>
  );
};

export default EventForm;
