import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  CalendarDays,
  Clock3,
  Globe,
  Heart,
  MapPin,
  Share2,
  ExternalLink,
} from "lucide-react";

import toast from "react-hot-toast";

import { getEventById } from "../services/event.services";
import {
  createOrder,
  verifyPayment,
} from "../services/payment.services";

import { getUser } from "../utils/auth";
import { updateWishlist } from "../services/user.services";
// import toast from "react-hot-toast";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [readMore, setReadMore] = useState(false);
  const [sharing, setSharing] = useState(false);

  const user = getUser();

  // ================= FETCH EVENT =================

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);

        const res = await getEventById(id);

        setData(res.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id]);

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-lg font-semibold">
        Loading Event...
      </div>
    );
  }

  // ================= NOT FOUND =================

  if (!data) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl font-semibold">
        Event Not Found
      </div>
    );
  }

  // ================= EVENT STATUS =================

  const ticketsLeft = data.capacity - data.ticketSold;

  const soldPercentage =
    data.capacity > 0
      ? (data.ticketSold / data.capacity) * 100
      : 0;

  let status = "Available";

  if (ticketsLeft <= 0) {
    status = "Sold Out";
  } else if (soldPercentage >= 80) {
    status = "Few Left";
  }

  // ================= DATE =================

  const formattedDate = new Date(
    data.startDate
  ).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const startTime = new Date(
    data.startDate
  ).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const endTime = new Date(
    data.endDate
  ).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // ================= MEETING LINK =================

  const meetingLink = data?.meetingLink?.startsWith(
    "http"
  )
    ? data.meetingLink
    : `https://${data.meetingLink}`;


  const shareEvent = async ()=>{
    if(navigator.share){
      navigator.share({
        text : "hello"
      })
    }
  }

  // ================= PAYMENT =================

  const handlePayment = async () => {
    try {
      const res = await createOrder(data._id);

      const orderData = res.data;

      const options = {
        key: orderData.key_id,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "SwiftPass",
        description: "Event Ticket Purchase",
        order_id: orderData.order.id,

        handler: async (response) => {
          try {
            const toastId = toast.loading(
              "Verifying payment..."
            );

            const verificationResponse =
              await verifyPayment(response, data);

            if (verificationResponse.success) {
              toast.success(
                "Ticket Purchased Successfully!",
                {
                  id: toastId,
                }
              );

              navigate("/payment-success", {
                state: {
                  ticket: verificationResponse.data,
                },
              });
            }
          } catch (error) {
            toast.error(
              "Payment verification failed."
            );

            console.log(error);
          }
        },

        prefill: {
          name: user?.name,
          email: user?.email,
        },

        theme: {
          color: "#000000",
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.open();
    } catch (error) {
      toast.error(error.message);

      console.log(error);
    }
  };

  const handleWishlist = async (eventId) => {

    try {
      const response = await updateWishlist(eventId)
      console.log(response);
      toast.success(response.data.message)
    } catch (error) {
      toast.error(error.message)
      console.log(error);
    }
  }

  return (
    <div className="min-h-screen bg-white pb-28">

      {/* ================= CONTAINER ================= */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5">

        {/* ================= HERO ================= */}

        <div className="relative h-[300px] sm:h-[420px] lg:h-[500px] rounded-3xl overflow-hidden">

          <img
            src={data.bannerImage}
            alt={data.title}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/35" />

          {/* ACTIONS */}

          <div className="absolute top-4 right-4 flex gap-2 z-10">

            <button
              onClick={shareEvent}
              disabled={sharing}
              className="h-11 w-11 rounded-full bg-white/90 backdrop-blur flex justify-center items-center hover:bg-white transition cursor-pointer"
            >
              <Share2 size={18} />
            </button>

            <button
              onClick={() => {
                setLiked(!liked)
                handleWishlist(data._id)
              }}
              className={`h-11 w-11 rounded-full backdrop-blur flex justify-center items-center transition cursor-pointer
              ${liked
                  ? "bg-black text-white"
                  : "bg-white/90 hover:bg-white"
                }`}
            >
              <Heart
                size={18}
                fill={liked ? "currentColor" : "none"}
              />
            </button>

          </div>

          {/* HERO CONTENT */}

          <div className="absolute bottom-0 left-0 w-full p-5 sm:p-8 text-white">

            <span className="text-xs sm:text-sm bg-white/20 backdrop-blur px-3 py-1 rounded-full">
              {data.category}
            </span>

            <h1 className="text-3xl sm:text-5xl font-bold mt-4 max-w-4xl leading-tight">
              {data.title}
            </h1>

            <div className="flex flex-wrap gap-5 mt-5 text-sm text-gray-200">

              <span className="flex items-center gap-2">
                <CalendarDays size={16} />
                {formattedDate}
              </span>

              <span className="flex items-center gap-2">
                <Clock3 size={16} />
                {startTime} - {endTime}
              </span>

              <span className="flex items-center gap-2">
                {data.type === "ONLINE" ? (
                  <Globe size={16} />
                ) : (
                  <MapPin size={16} />
                )}

                {data.type}
              </span>

            </div>
          </div>
        </div>

        {/* ================= MAIN LAYOUT ================= */}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 mt-10">

          {/* ================= LEFT ================= */}

          <div>

            {/* ORGANIZER */}

            <div className="flex items-center justify-between flex-wrap gap-4">

              <div className="flex items-center gap-4">

                <img
                  src={
                    data?.organiserId?.avatar ||
                    "https://img.magnific.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
                  }
                  alt="organizer"
                  className="w-14 h-14 rounded-full object-cover"
                />

                <div>
                  <p className="font-semibold text-lg">
                    {data?.organiserId?.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    Event Organizer
                  </p>
                </div>

              </div>

              <button className="border border-gray-300 px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-50 transition cursor-pointer">
                Follow
              </button>

            </div>

            {/* ABOUT */}

            <section className="mt-12">

              <h2 className="text-2xl sm:text-3xl font-bold">
                About this event
              </h2>

              <p
                className={`mt-5 text-gray-600 leading-8 text-[15px]
                ${!readMore &&
                    data.description?.length > 250
                    ? "line-clamp-4"
                    : ""
                  }`}
              >
                {data.description}
              </p>

              {data.description?.length > 250 && (
                <button
                  onClick={() =>
                    setReadMore(!readMore)
                  }
                  className="mt-4 text-sm font-semibold underline underline-offset-4 cursor-pointer"
                >
                  {readMore
                    ? "Read Less"
                    : "Read More"}
                </button>
              )}

            </section>

            {/* EVENT DETAILS */}

            <section className="mt-14">

              <h2 className="text-2xl sm:text-3xl font-bold">
                Event Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">

                {/* DATE */}

                <div className="rounded-2xl border border-gray-200 p-5">

                  <div className="flex items-start gap-3">

                    <CalendarDays size={18} />

                    <div>

                      <p className="font-semibold">
                        Date & Time
                      </p>

                      <p className="text-sm text-gray-500 mt-2">
                        {formattedDate}
                      </p>

                      <p className="text-sm text-gray-500">
                        {startTime} - {endTime}
                      </p>

                    </div>
                  </div>
                </div>

                {/* TYPE */}

                <div className="rounded-2xl border border-gray-200 p-5">

                  <div className="flex items-start gap-3">

                    {data.type === "ONLINE" ? (
                      <Globe size={18} />
                    ) : (
                      <MapPin size={18} />
                    )}

                    <div>

                      <p className="font-semibold">
                        {data.type === "ONLINE"
                          ? "Online Event"
                          : "Offline Event"}
                      </p>

                      {data.type === "ONLINE" ? (
                        <div className="mt-2">

                          <p className="text-sm text-gray-500">
                            {data.platform}
                          </p>

                          {data.meetingLink && (
                            <a
                              href={meetingLink}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-sm mt-2 underline underline-offset-4"
                            >
                              Join Meeting
                              <ExternalLink size={14} />
                            </a>
                          )}

                        </div>
                      ) : (
                        <div className="mt-2">

                          <p className="text-sm text-gray-500">
                            {data.location ||
                              "Venue to be announced"}
                          </p>

                          {data.city &&
                            data.city !==
                            "undefined" && (
                              <p className="text-sm text-gray-500 mt-1">
                                {data.city}
                              </p>
                            )}

                        </div>
                      )}

                    </div>
                  </div>
                </div>

                {/* CAPACITY */}

                <div className="rounded-2xl border border-gray-200 p-5">

                  <p className="text-sm text-gray-500">
                    Capacity
                  </p>

                  <p className="text-2xl font-bold mt-2">
                    {data.capacity}
                  </p>

                </div>

                {/* TICKETS */}

                <div className="rounded-2xl border border-gray-200 p-5">

                  <p className="text-sm text-gray-500">
                    Tickets Left
                  </p>

                  <p className="text-2xl font-bold mt-2">
                    {ticketsLeft}
                  </p>

                </div>

              </div>
            </section>

            {/* TAGS */}

            {data.tags?.length > 0 && (
              <section className="mt-14">

                <h2 className="text-2xl sm:text-3xl font-bold">
                  Tags
                </h2>

                <div className="flex flex-wrap gap-3 mt-5">

                  {data.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 rounded-full border border-gray-200 text-sm"
                    >
                      #{tag}
                    </span>
                  ))}

                </div>
              </section>
            )}

          </div>

          {/* ================= RIGHT SIDEBAR ================= */}

          <div className="hidden lg:block">

            <div className="sticky top-24 rounded-3xl border border-gray-200 p-7">

              <div className="flex justify-between items-start">

                <div>

                  <p className="text-4xl font-bold">
                    {data.price === 0
                      ? "Free"
                      : `₹${data.price}`}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    per ticket
                  </p>

                </div>

                <span className="text-xs bg-black text-white px-3 py-1 rounded-full">
                  {status}
                </span>

              </div>

              <div className="space-y-5 mt-10">

                <div className="flex justify-between text-sm">

                  <span className="text-gray-500">
                    Tickets Sold
                  </span>

                  <span className="font-medium">
                    {data.ticketSold}
                  </span>

                </div>

                <div className="flex justify-between text-sm">

                  <span className="text-gray-500">
                    Capacity
                  </span>

                  <span className="font-medium">
                    {data.capacity}
                  </span>

                </div>

                <div className="flex justify-between text-sm">

                  <span className="text-gray-500">
                    Category
                  </span>

                  <span className="font-medium">
                    {data.category}
                  </span>

                </div>

              </div>

              <button
                onClick={handlePayment}
                disabled={
                  status === "Sold Out" ||
                  data.status === "DRAFT"
                }
                className={`w-full mt-10 py-4 rounded-2xl font-semibold transition
                ${status === "Sold Out" ||
                    data.status === "DRAFT"
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-black text-white hover:opacity-90 cursor-pointer"
                  }`}
              >
                {data.status === "DRAFT"
                  ? "Event Not Published"
                  : data.price === 0
                    ? "Reserve Spot"
                    : "Book Tickets"}
              </button>

            </div>
          </div>

        </div>
      </div>

      {/* ================= MOBILE BOOKING BAR ================= */}

      <div className="lg:hidden fixed bottom-0 left-0 w-full border-t border-gray-200 bg-white p-4 z-50">

        <div className="flex items-center justify-between gap-4">

          <div>

            <p className="text-xl font-bold">
              {data.price === 0
                ? "Free"
                : `₹${data.price}`}
            </p>

            <p className="text-xs text-gray-500 mt-1">
              {ticketsLeft} spots left
            </p>

          </div>

          <button
            onClick={handlePayment}
            disabled={
              status === "Sold Out" ||
              data.status === "DRAFT"
            }
            className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap
            ${status === "Sold Out" ||
                data.status === "DRAFT"
                ? "bg-gray-200 text-gray-500"
                : "bg-black text-white"
              }`}
          >
            {data.price === 0
              ? "Reserve Spot"
              : "Book Now"}
          </button>

        </div>
      </div>
    </div>
  );
}

export default EventDetails;