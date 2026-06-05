import React, { useEffect, useState } from "react";
import { getUser } from "../utils/auth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getUserWishlist } from "../services/user.services";
import { CalendarDays,  MapPin, IndianRupee, Heart,  ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

function Wishlist() {
  const currentUser = getUser();
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (!currentUser) {
      toast.error("Please sign in to view your wishlist");
      navigate("/login");
      return;
    }

    const fetchWishlist = async () => {
      try {
        const response = await getUserWishlist();
        setWishlist(response?.data?.wishlist || []);
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            "Failed to load wishlist"
        );
      }
    };

    fetchWishlist();
  }, [currentUser, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-100">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl rounded-3xl p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-5xl font-extrabold text-green-700">
                  My Wishlist
                </h1>

                <p className="mt-3 text-gray-600 text-lg">
                  Your collection of saved experiences.
                </p>
              </div>

              <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-5 rounded-2xl shadow-lg">
                <p className="text-sm opacity-90">
                  Saved Events
                </p>

                <h2 className="text-4xl font-bold">
                  {wishlist.length}
                </h2>
              </div>
            </div>
          </div>
        </motion.div>

        {wishlist.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center min-h-[60vh]"
          >
            <div className="bg-white rounded-3xl shadow-2xl border border-green-100 p-14 text-center max-w-xl w-full">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                <Heart
                  size={42}
                  className="text-green-600"
                />
              </div>

              <h2 className="text-3xl font-bold text-green-700 mb-3">
                Wishlist Empty
              </h2>

              <p className="text-gray-500 mb-8">
                Start exploring events and save the ones
                that catch your attention.
              </p>

              <button
                onClick={() => navigate("/")}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold hover:scale-105 transition-all duration-300"
              >
                Explore Events
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlist.map((event, index) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 35 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.08,
                  duration: 0.4,
                }}
                className="group"
              >
                <div
                  onClick={() =>
                    navigate(`/eventDetails/${event._id}`)
                  }
                  className="relative overflow-hidden rounded-3xl bg-white border border-green-100 shadow-lg hover:shadow-2xl hover:shadow-green-200/50 cursor-pointer transition-all duration-500 hover:-translate-y-3"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={event.bannerImage}
                      alt={event.title}
                      className="h-64 w-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                    <div className="absolute top-4 right-4">
                      <div className="bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg">
                        <Heart
                          size={18}
                          className="fill-green-600 text-green-600"
                        />
                      </div>
                    </div>

                    <div className="absolute top-4 left-4">
                      <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {event.category}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      <h2 className="text-white text-2xl font-bold line-clamp-1">
                        {event.title}
                      </h2>

                      <div className="flex items-center gap-2 mt-2 text-white/90 text-sm">
                        <CalendarDays size={15} />
                        <span>
                          {new Date(
                            event.startDate
                          ).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-gray-600 text-sm line-clamp-3 mb-5">
                      {event.description}
                    </p>

                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin
                          size={16}
                          className="text-green-600"
                        />

                        <span className="text-sm">
                          {event.type === "ONLINE"
                            ? "Online Event"
                            : event.city ||
                              event.location ||
                              "Location TBA"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-green-700 font-bold text-lg">
                        <IndianRupee size={17} />

                        <span>
                          {event.price === 0
                            ? "Free"
                            : event.price}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(
                          `/eventDetails/${event._id}`
                        );
                      }}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300"
                    >
                      View Event
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;