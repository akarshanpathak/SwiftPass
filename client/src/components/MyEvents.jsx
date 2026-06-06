import React, { useEffect, useState } from "react";
import { getUser } from "../utils/auth";
import { getAllEventForUser } from "../services/event.services";

function MyEvents() {
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = getUser();

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

    if (currentUser) {
      fetchEvent();
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col justify-center items-center gap-3">
        <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
        <p className="text-green-700 font-medium text-sm tracking-wide">Loading your events...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-6xl mx-auto">

        <div className="mb-10 flex items-center gap-4">
          <div className="w-1.5 h-10 bg-green-500 rounded-full" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Events</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {myEvents.length > 0 ? `${myEvents.length} event${myEvents.length > 1 ? "s" : ""} found` : "Manage your created events"}
            </p>
          </div>
        </div>

        {myEvents.length === 0 ? (
          <div className="bg-white border border-green-100 rounded-2xl p-16 text-center shadow-sm">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-700">No events yet</h2>
            <p className="text-gray-400 mt-1 text-sm">You haven't created any events yet.</p>
            <button className="mt-6 px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors">
              Create Your First Event
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myEvents.map((event) => (
              <div
                key={event._id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="relative h-48 overflow-hidden bg-green-50">
                  <img
                    src={event.bannerImage}
                    alt={event.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <span
                    className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      event.status === "PUBLISHED"
                        ? "bg-green-500 text-white"
                        : "bg-amber-400 text-white"
                    }`}
                  >
                    {event.status}
                  </span>
                </div>

                <div className="p-5">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-medium border border-green-100 mb-3">
                    {event.category}
                  </span>

                  <h2 className="text-base font-bold text-gray-900 mb-1 line-clamp-1">
                    {event.title}
                  </h2>
                  <p className="text-gray-400 text-xs leading-relaxed mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="space-y-1.5 text-xs text-gray-600 mb-5">
                    <div className="flex items-center gap-2">
                      <span className="w-4 text-center">📍</span>
                      <span className="font-medium">{event.city}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-4 text-center">📅</span>
                      <span>
                        {new Date(event.startDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-4 text-center">🎟️</span>
                      <span>
                        <span className="font-semibold text-green-600">{event.ticketSold}</span>
                        <span className="text-gray-400"> / {event.capacity} sold</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-4 text-center">💰</span>
                        <span className="font-semibold text-gray-800">₹{event.price}</span>
                      </div>
                      <span className="text-gray-400 italic">{event.type}</span>
                    </div>
                  </div>

                  <div className="mb-5">
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div
                        className="bg-green-400 h-1.5 rounded-full"
                        style={{ width: `${Math.min((event.ticketSold / event.capacity) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-2 rounded-lg transition-colors">
                      View
                    </button>
                    
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyEvents;