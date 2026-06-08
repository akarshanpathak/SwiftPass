import React, { useEffect, useState } from "react";
import { getUser } from "../utils/auth";
import { getAllEventForUser } from "../services/event.services";
import { FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function MyEvents() {
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = getUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await getAllEventForUser();
        setMyEvents(response.data.data || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (currentUser) fetchEvent();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 w-full bg-gradient-to-br from-green-50 via-white to-green-100 min-h-screen flex flex-col justify-center items-center gap-3">
        <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
        <p className="text-green-700 font-medium text-sm tracking-wide">Loading your events...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full p-4 sm:p-6 md:p-10  min-h-screen">

      <div className="flex items-center gap-3 mb-8">
        <FaCalendarAlt className="text-green-500 text-2xl" />
        <h2 className="text-2xl font-bold text-gray-800 font-poppins">My Events</h2>
        {myEvents.length > 0 && (
          <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full ml-1">
            {myEvents.length} event{myEvents.length > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {myEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-24 gap-5">
          <div className="w-20 h-20 bg-white/70 backdrop-blur-xl rounded-full flex items-center justify-center shadow-md border border-white/40">
            <FaCalendarAlt className="text-4xl text-green-300" />
          </div>
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-700">No events yet</h2>
            <p className="text-gray-400 text-sm mt-1">You haven't created any events yet.</p>
          </div>
          <button
            onClick={() => navigate("/create-event")}
            className="mt-2 px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-semibold rounded-2xl shadow-lg hover:scale-105 hover:shadow-green-300 duration-300"
          >
            Create Your First Event
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {myEvents.map((event) => (
            <div
              key={event._id}
              className="bg-white/70 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/40 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
            >
               <div className="relative h-44 overflow-hidden bg-green-50">
                <img
                  src={event.bannerImage}
                  alt={event.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold ${
                  event.status === "PUBLISHED"
                    ? "bg-green-500 text-white"
                    : "bg-amber-400 text-white"
                }`}>
                  {event.status}
                </span>
              </div>

              <div className="p-5">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-medium border border-green-100 mb-3">
                  {event.category}
                </span>

                <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-1">
                  {event.title}
                </h3>
                <p className="text-gray-400 text-xs leading-relaxed mb-4 line-clamp-2">
                  {event.description}
                </p>

                <div className="space-y-1.5 text-xs text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <span>📍</span>
                    <span className="font-medium">{event.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📅</span>
                    <span>
                      {new Date(event.startDate).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>🎟️</span>
                      <span>
                        <span className="font-semibold text-green-600">{event.ticketSold}</span>
                        <span className="text-gray-400"> / {event.capacity} sold</span>
                      </span>
                    </div>
                    <span className="font-semibold text-gray-800">₹{event.price}</span>
                  </div>
                </div>

                <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4">
                  <div
                    className="bg-green-400 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((event.ticketSold / event.capacity) * 100, 100)}%` }}
                  />
                </div>

                <button
                  onClick={() => navigate(`/events/${event._id}`)}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-sm font-semibold py-2 rounded-xl transition-all duration-200 hover:shadow-md"
                >
                  View Event
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyEvents;