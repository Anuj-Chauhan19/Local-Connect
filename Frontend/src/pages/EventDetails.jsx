import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { registerEvent, likeEvent } from "../features/eventSlice";

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = React.useState(null);
  const { token, user } = useSelector((s) => s.user);
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get(`http://localhost:8080/events/${id}`)
      .then((res) => setEvent(res.data));
  }, [id]);

  if (!event) return <p>Loading...</p>;

  const handleRegister = async (id) => {
    try {
      await dispatch(registerEvent(id)).unwrap();
      alert("Registered successfully!");
    } catch (err) {
      alert(err?.error || "Registration failed");
    }
  };
  const isRegistered = event.attendees?.some((att) => att._id === user?._id);
  const isFull = event.attendees?.length >= event.maxAttendees;
  const isLiked = event.likes?.includes(user?._id);

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h2 className="text-3xl font-bold">{event.title}</h2>
      <img
        src={event.image.replace("/upload/", "/upload/c_fill,w_600,h_200/")}
        alt={event.title}
        className="w-full h-64 object-cover"
      />
      <div className="text-gray-700 space-y-2">
        <p>
          <strong>Description:</strong> {event.description}
        </p>
        <p>
          <strong>Date & Time:</strong>{" "}
          {new Date(event.date).toLocaleDateString()} @ {event.time}
        </p>
        <p>
          <strong>Venue:</strong> {event.venue}
        </p>
        <p>
          <strong>Price:</strong>{" "}
          {event.ticketPrice ? `₹${event.ticketPrice}` : "Free"}
        </p>
        <p>
          <strong>Location:</strong> {event.location}, {event.country}
        </p>
        <p>
          <strong>Category:</strong> {event.category}
        </p>
        <p>
          <strong>Organizer:</strong> {event.organizer?.username} (
          {event.organizer?.email})
        </p>
        <p>
          <strong>Attendees:</strong> {event.attendees.length} /{" "}
          {event.maxAttendees || "∞"}
        </p>
        <p>
          <strong>Total Likes:</strong> {event.likes.length}
        </p>
      </div>

      <div className="space-x-2">
        <button
          className={`px-3 py-1 rounded ${
            isRegistered ? "bg-green-500 text-white" : "bg-blue-500 text-white"
          } disabled:bg-gray-400`}
          onClick={() => {
            console.log("Clicked event:", event);
            if (!isRegistered) handleRegister(event._id);
          }}
          disabled={!token || isRegistered || isFull}
        >
          {token
            ? isRegistered
              ? "Registered"
              : isFull
              ? "Event Full"
              : "Register"
            : "Login to Participate"}
        </button>
        <button
          className={`px-3 py-1 rounded ${
            isLiked ? "bg-pink-600" : "bg-red-500"
          } text-white`}
          onClick={() =>{ console.log("Clicked event:", event.likes); dispatch(likeEvent(event._id))}}
          disabled={!token}
        >
          {isLiked ? "💖 Unlike" : "❤️ Like"} {event.likes?.length || 0}
        </button>
      </div>
    </div>
  );
}
