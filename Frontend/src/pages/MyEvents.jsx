import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyEvents } from "../features/eventSlice";

export default function MyEvents() {
  const dispatch = useDispatch();
  const { mine } = useSelector((s) => s.events);

  useEffect(() => {
    dispatch(fetchMyEvents());
  }, [dispatch]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">My Events</h2>
        <a
          href="/events/new"
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Create New Event
        </a>
      </div>
      {mine.length === 0 ? (
        <p>You haven't created any events yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {mine.map((e) => (
            <div key={e._id} className="border p-4 rounded">
              <h3 className="text-xl font-bold">{e.title}</h3>
              <p>
                {new Date(e.date).toLocaleDateString()} @ {e.time}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
