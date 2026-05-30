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
  CheckCircle2,
} from "lucide-react";

import toast from "react-hot-toast";

import { getEventById } from "../services/event.services";
import { createOrder, verifyPayment } from "../services/payment.services";
import { getUser } from "../utils/auth";
import { isFollowing, isInWishList, updateFollowers, updateFollowing , updateWishlist } from "../services/user.services";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [readMore, setReadMore] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [organiserId, setOrganiserId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [follows, setFollows] = useState(false);
  const [eventId, setEventId] = useState(null)

  const user = getUser();



  // FETCH EVENT 
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await getEventById(id);
        setData(res.data.data);
        setEventId(res.data.data._id);

        setOrganiserId(res.data.data.organiserId._id)
        console.log("organiserid ", res.data.data.organiserId._id);
        
        setUserId(user._id)
        console.log("user id " , user._id);
        
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

  //check if already in wishlist
  useEffect(() => {
    const check = async (eventId) => {
      try {
        const response = await isInWishList(eventId)
        setLiked(response.data.inWishlist)
      } catch (error) {
        console.log("error from is in Wishlist useeffect", error);
      }
    }

    if (eventId) {
      check(eventId)
    }
  }, [eventId])

  //check if already follows
  useEffect( ()=>{
      const check = async (organiserId) =>{
      try {
        const response = await isFollowing(organiserId)
        console.log("check if already follows runninf" , response);
        
        setFollows(response.data.following)
      } catch (error) {
        console.log("error from isfollowing useeffect" , error);
      }
    }

    if(organiserId){
      check(organiserId)
    }
  } , [organiserId])

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-sm font-medium tracking-wide text-gray-500">
        Loading Event...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex justify-center items-center text-lg font-medium text-gray-900">
        Event Not Found
      </div>
    );
  }

  const ticketsLeft = data.capacity - data.ticketSold;
  const soldPercentage = data.capacity > 0 ? (data.ticketSold / data.capacity) * 100 : 0;

  let status = "Available";
  if (ticketsLeft <= 0) {
    status = "Sold Out";
  } else if (soldPercentage >= 80) {
    status = "Few Left";
  }

  const formattedDate = new Date(data.startDate).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const startTime = new Date(data.startDate).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const endTime = new Date(data.endDate).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const meetingLink = data?.meetingLink?.startsWith("http")
    ? data.meetingLink
    : `https://${data.meetingLink}`;

  const shareEvent = async () => {
    if (navigator.share) {
      try {
        setSharing(true);
        await navigator.share({ text: `Check out this event: ${data.title}`, url: window.location.href });
      } catch (err) {
        console.log(err);
      } finally {
        setSharing(false);
      }
    } else {
      toast.success("Link copied to clipboard!");
    }
  };

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
            const toastId = toast.loading("Verifying payment...");
            const verificationResponse = await verifyPayment(response, data);
            console.log("verificationResponse" , verificationResponse);
            
            if (verificationResponse.success) {
              toast.success("Ticket Purchased Successfully!", { id: toastId });
              navigate("/payment-success", {
                state: { ticket: verificationResponse.data },
              });
            }
          } catch (error) {
            toast.error("Payment verification failed.");
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
      const response = await updateWishlist(eventId);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const handleFollowerFollowing = async () => {
    try {
      const responseFollower = await updateFollowers(organiserId);
      const responseFollowing = await updateFollowing(organiserId)
      
      console.log(responseFollower);
      console.log(responseFollowing);
      
      setFollows((prev) => !prev)
    } catch (error) {
      console.log("Error from handleFollowerFollowing " , error);
      
    }
  }

  return (
    <div className="min-h-screen bg-white pb-32 font-sans antialiased">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">

        {/* ================= HERO (IMAGE UNTOUCHED) ================= */}
        <div className="relative h-[300px] sm:h-[420px] lg:h-[500px] rounded-3xl overflow-hidden shadow-sm">
          <img
            src={data.bannerImage}
            alt={data.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* ACTIONS */}
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <button
              onClick={shareEvent}
              disabled={sharing}
              className="h-10 w-10 rounded-full bg-white text-black flex justify-center items-center hover:bg-gray-100 transition shadow-sm cursor-pointer"
            >
              <Share2 size={16} />
            </button>

            <button
              onClick={() => {
                setLiked(!liked);
                handleWishlist(data._id);
              }}
              className={`h-10 w-10 rounded-full flex justify-center items-center transition shadow-sm cursor-pointer ${liked
                  ? "bg-pink-500"
                  : "bg-white hover:bg-gray-100"
                }`}
            >
              <Heart
                size={16}
                fill={liked ? "currentColor" : "none"}
                className={liked ? "text-white hover:scale-125 duration-150" : "text-black hover:scale-125 duration-150"}
              />
            </button>
          </div>

          {/* HERO CONTENT */}
          <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 text-white">
            <span className="text-xs font-medium uppercase tracking-wider bg-white/20 backdrop-blur-md px-3 py-1 rounded-md">
              {data.category}
            </span>

            <h1 className="text-2xl sm:text-4xl font-bold mt-3 max-w-3xl leading-tight">
              {data.title}
            </h1>
          </div>
        </div>

        {/* ================= VERTICAL CONTENT FLOW ================= */}
        <div className="mt-8 space-y-10">

          {/* QUICK METRICS BAR */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 border-b border-gray-100 pb-6">
            <span className="flex items-center gap-2 font-medium text-black">
              <CalendarDays size={16} className="text-gray-400" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-2">
              <Clock3 size={16} className="text-gray-400" />
              {startTime} - {endTime}
            </span>
            <span className="flex items-center gap-2">
              {data.type === "ONLINE" ? (
                <Globe size={16} className="text-gray-400" />
              ) : (
                <MapPin size={16} className="text-gray-400" />
              )}
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-800">
                {data.type}
              </span>
            </span>
          </div>

          {/* ORGANIZER SECTION */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-6">
            <div className="flex items-center gap-3">
              <img
                src={data?.organiserId?.avatar || "https://img.magnific.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"}
                alt="organizer"
                className="w-12 h-12 rounded-full object-cover border border-gray-100"
              />
              <div>
                <p className="font-semibold text-gray-900 text-base">{data?.organiserId?.name}</p>
                <p className="text-xs text-gray-400">Host & Organizer</p>
              </div>
            </div>
            {
              organiserId !== userId && <button onClick={handleFollowerFollowing} className="border border-black px-4 py-1.5 rounded-full text-xs font-medium hover:bg-black hover:text-white transition cursor-pointer">
             {follows === true ? "following" : "follow"}
            </button>
            }
          </div>

          {/* ABOUT SECTION */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">About this event</h2>
            <p className={`mt-3 text-gray-600 leading-relaxed text-[15px] ${!readMore && data.description?.length > 250 ? "line-clamp-4" : ""}`}>
              {data.description}
            </p>
            {data.description?.length > 250 && (
              <button
                onClick={() => setReadMore(!readMore)}
                className="mt-2 text-xs font-bold uppercase tracking-wider text-black underline underline-offset-4 cursor-pointer hover:text-gray-600"
              >
                {readMore ? "Read Less" : "Read More"} 
              </button> 
            )}
          </section>

          {/* DYNAMIC METADATA GRID */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-b border-gray-100 py-8">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Location & Venue</p>
              <p className="text-sm font-semibold text-gray-900">
                {data.type === "ONLINE" ? `Online via ${data.platform || "Platform"}` : data.location || "Venue TBA"}
              </p>
              {data.type === "ONLINE" && data.price === 0 && data.meetingLink && (
                <a
                  href={meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium underline underline-offset-2 mt-1"
                >
                  Join Live Session <ExternalLink size={12} />
                </a>
              )}
              {!data.type === "ONLINE" && data.city && (
                <p className="text-xs text-gray-500">{data.city}</p>
              )}
            </div>

            <div className="space-y-1 sm:border-l sm:border-gray-100 sm:pl-6">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Availability</p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-gray-900">{ticketsLeft} spots left</p>
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${status === "Sold Out" ? " text-red-700" : " text-emerald-700"
                  }`}>
                  {status}
                </span>
              </div>
              <p className="text-xs text-gray-500">Total capacity: {data.capacity} seats</p>
            </div>
          </section>

          {/* TAGS */}
          {data.tags?.length > 0 && (
            <section>
              <div className="flex flex-wrap gap-2">
                {data.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 rounded-md bg-gray-50 text-gray-600 border border-gray-100 text-xs font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* DESKTOP INTEGRATED TICKETING BLOCK */}
          <section className="bg-gray-50 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border border-gray-100">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Ticket Pricing</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-bold text-gray-900">{data.price === 0 ? "Free" : `₹${data.price}`}</span>
                {data.price > 0 && <span className="text-xs text-gray-400">/ per ticket</span>}
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={status === "Sold Out" || data.status === "DRAFT"}
              className={`px-8 py-3.5 rounded-xl font-semibold tracking-wide text-sm transition shadow-sm sm:w-auto w-full ${status === "Sold Out" || data.status === "DRAFT"
                ? "bg-gray-200 text-gray-800 cursor-not-allowed shadow-none"
                : "bg-green-500 text-white hover:bg-green-600 cursor-pointer"
                }`}
            >
              {data.status === "DRAFT" ? "Event Not Published" : data.price === 0 ? "Reserve Spot" : "Book Passes"}
            </button>
          </section>

        </div>
      </div>

      {/* ================= MOBILE BOTTOM ACCENT BAR ================= */}
      <div className="sm:hidden fixed bottom-0 left-0 w-full border-t border-gray-100 bg-white/95 backdrop-blur-md p-4 z-50 flex items-center justify-between gap-4">
        <div>
          <p className="text-lg font-bold text-gray-900">{data.price === 0 ? "Free" : `₹${data.price}`}</p>
          <p className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {ticketsLeft} spots remaining
          </p>
        </div>

        <button
          onClick={handlePayment}
          disabled={status === "Sold Out" || data.status === "DRAFT"}
          className={`px-6 py-3 rounded-xl font-semibold text-xs uppercase tracking-wider ${status === "Sold Out" || data.status === "DRAFT"
            ? "bg-gray-100 text-gray-400"
            : "bg-green-500 text-white"
            }`}
        >
          {data.price === 0 ? "Reserve" : "Book Now"}
        </button>
      </div>

    </div>
  );
}

export default EventDetails;