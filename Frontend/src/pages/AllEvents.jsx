import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllEvents,
  registerEvent,
  likeEvent,
} from "../features/eventSlice";
import { Link } from "react-router-dom";

export default function AllEvents() {
  const dispatch = useDispatch();
  const { all } = useSelector((s) => s.events);
const { token, userInfo } = useSelector((s) => s.user);
const user = userInfo || JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    dispatch(fetchAllEvents());
  }, [dispatch]);

  const handleRegister = async (id) => {
    try {
      await dispatch(registerEvent(id)).unwrap();
      alert("Registered successfully!");
    } catch (err) {
      alert(err?.error || "Registration failed");
    }
  };

 

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">All Events</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {all.map((e) => {
          const isRegistered = e.attendees?.some(
            (att) => att._id === user?._id
          );
          const isFull = e.attendees?.length >= e.maxAttendees;
          const isLiked = e.likes?.includes(user?._id);

          // console.log(isRegistered);
          // console.log(isLiked);
          return (
            <div key={e._id} className="border p-4 rounded">
              <img
                src={e.image.replace("/upload/", "/upload/c_fill,w_600,h_200/")}
                alt={e.title}
                className="w-full h-40 object-cover rounded"
              />
              <h3 className="text-xl font-bold mt-2">{e.title}</h3>
              <p>
                {new Date(e.date).toLocaleDateString()} @ {e.time}
              </p>
              <div className="mt-2 flex space-x-2">
                <button
                  className={`px-3 py-1 rounded ${
                    isRegistered
                      ? "bg-green-500 text-white"
                      : "bg-blue-500 text-white"
                  } disabled:bg-gray-400`}
                  onClick={() => {
                    console.log("Clicked event:", e);
                    if (!isRegistered) handleRegister(e._id);
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
                  onClick={() => dispatch(likeEvent(e._id))}
                  disabled={!token}
                >
                  {isLiked ? "💖 Unlike" : "❤️ Like"} {e.likes?.length || 0}
                </button>
                <Link to={`/events/${e._id}`} className="underline ml-auto">
                  View
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
