import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import {
  CalendarDays,
  MapPin,
  Clock,
  Ticket as TicketIcon,
  BadgeCheck,
  IndianRupee,
  ArrowLeft,
  Tag,
  Building2,
} from "lucide-react";

function InfoCard({ icon, title, value, highlight = false }) {
  return (
    <div
      className={`rounded-2xl p-5 transition hover:shadow-md ${
        highlight
          ? "bg-emerald-50 border border-emerald-200"
          : "bg-gray-50 border border-gray-100"
      }`}
    >
      <div className="flex items-center gap-2 text-emerald-600">
        {icon}
        <span className="text-sm font-semibold">{title}</span>
      </div>
      <p className="mt-3 text-gray-900 font-semibold leading-6">{value}</p>
    </div>
  );
}

function Ticket() {
  const location = useLocation();
  const navigate = useNavigate();

  const ticket = location.state?.ticket;

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center px-4">
        <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md w-full">
          <div className="w-20 h-20 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-4">
            <TicketIcon className="text-red-500" size={36} />
          </div>

          <h1 className="text-2xl font-bold text-gray-900">Ticket Not Found</h1>

          <p className="text-gray-500 mt-3">
            We couldn't find your ticket details.
          </p>

          <button
            onClick={() => navigate("/")}
            className="mt-6 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition"
          >
            <ArrowLeft size={18} />
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const event = ticket.event;

  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);

  const formattedStartDate = startDate.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedEndDate = endDate.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedStartTime = startDate.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedEndTime = endDate.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const purchasedOn = new Date(ticket.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-gray-600 hover:text-emerald-600 font-medium transition"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="bg-white rounded-[32px] shadow-[0_20px_60px_rgba(16,185,129,0.15)] overflow-hidden">
          <div className="px-8 pt-8 text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold">
              <Tag size={14} />
              {event.category}
            </span>

            <h1 className="mt-5 text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
              {event.title}
            </h1>

            <p className="mt-4 text-gray-600 max-w-2xl mx-auto leading-7">
              {event.description}
            </p>
          </div>

          <div className="px-6 md:px-8 mt-8">
            <div className="overflow-hidden rounded-3xl shadow-lg">
              <img
                src={event.bannerImage}
                alt={event.title}
                className="w-full h-64 md:h-80 object-cover"
              />
            </div>
          </div>

          <div className="relative my-10">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-emerald-50"></div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-emerald-50"></div>
            <div className="border-t-2 border-dashed border-gray-300 mx-6"></div>
          </div>

          <div className="px-6 md:px-8 pb-10">
            <div className="flex flex-col items-center">
              <div className="bg-white p-5 rounded-3xl shadow-xl border-2 border-emerald-100">
                <QRCode value={ticket.ticketId} size={220} />
              </div>

              <h2
                className="mt-6 text-2xl md:text-3xl font-bold text-gray-900"
                style={{ letterSpacing: "0.2em" }}
              >
                {ticket.ticketId}
              </h2>

              <div className="mt-4 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-green-100 text-green-700 font-semibold">
                <BadgeCheck size={18} />
                {ticket.status}
              </div>

              <p className="mt-4 text-gray-500 text-center max-w-md">
                Present this QR code at the event entrance for quick verification
                and seamless entry.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
              <InfoCard icon={<CalendarDays size={18} />} title="Start Date" value={formattedStartDate} />
              <InfoCard icon={<Clock size={18} />} title="Start Time" value={formattedStartTime} />
              <InfoCard icon={<CalendarDays size={18} />} title="End Date" value={formattedEndDate} />
              <InfoCard icon={<Clock size={18} />} title="End Time" value={formattedEndTime} />
              <InfoCard icon={<MapPin size={18} />} title="City" value={event.city} />
              <InfoCard icon={<Building2 size={18} />} title="Event Type" value={event.type} />
              <InfoCard icon={<Tag size={18} />} title="Category" value={event.category} />
              <InfoCard icon={<IndianRupee size={18} />} title="Amount Paid" value={`₹${ticket.pricePaid}`} highlight />
              <InfoCard icon={<TicketIcon size={18} />} title="Purchased On" value={purchasedOn} />
            </div>

            <div className="mt-10 bg-emerald-50 rounded-3xl p-6">
              <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                <MapPin size={18} />
                Event Location
              </div>
              <p className="mt-3 text-gray-700 leading-7">{event.location}</p>
            </div>

            <div className="mt-10 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-gray-900">About This Event</h3>
              <p className="mt-4 text-gray-700 leading-8">{event.description}</p>
            </div>

            

            <div className="mt-10 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500">
                This ticket is valid for one entry only.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Keep this QR code accessible for event check-in.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Ticket;
