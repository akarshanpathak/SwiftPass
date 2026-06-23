import React, { useEffect, useState } from "react";
import {
  MapPin,
  ArrowRight,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  LocateFixed,
  SquarePlay,
} from "lucide-react";
import { getCurrentLocation } from "../../services/user.services.js";
import { useDispatch } from "react-redux";
import { setCurrentLocation } from "../../redux/userSlice.js";
import {
  eventForCurrentLocation,
  forYou,
  onlineEvent,
  recentEvent,
  thisWeekend,
  today,
} from "../../services/event.services.js";
import RecentEvent from "../RecentEvent.jsx";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const CityEventsSection = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [events, setEvents] = useState([]);
  const [city, setCity] = useState("");
  const [eventType, setEventType] = useState("currentLocation"); 
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(false);
  
  const options = ["All", "For you", "Today", "This Weekend"];
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const dialogOptions = [
    {
      icon: LocateFixed,
      text: "Use my current location",
      fetch: "currentLocation",
    },
    {
      icon: SquarePlay,
      text: "Browse online events",
      fetch: "onlineEvent",
    },
  ];

  // 1. Fetching logic isolated and corrected
  const fetchEvents = async () => {
    setLoading(true);
    try {
      let response;

      // Handle Online Events completely separately to avoid Tab conflicts
      if (eventType === "onlineEvent") {
        response = await onlineEvent();
        setEvents(response?.data?.data || []);
        return;
      }

      // If location-based, handle tabs safely
      switch (activeTab) {
        case "All":
          response = city 
            ? await eventForCurrentLocation(city.toLowerCase()) 
            : await recentEvent();
          break;
        case "For you":
          if (city) response = await forYou(city.toLowerCase());
          break;
        case "Today":
          if (city) response = await today(city.toLowerCase());
          break;
        case "This Weekend":
          // Assumed you have a weekend endpoint service, replacing duplicate today()
          if (city) response = await thisWeekend(city.toLowerCase()); 
          break;
        default:
          response = await recentEvent();
      }

      if (response && response.data) {
        setEvents(response.data.data || []);
      } else {
        setEvents([]);
      }
    } catch (error) {
      toast.error(error.message || "Failed to load events");
      console.error(error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // 2. Geolocation core action
  const getLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          if (pos.coords.latitude && pos.coords.longitude) {
            const data = await getCurrentLocation(
              pos.coords.latitude,
              pos.coords.longitude
            );
            const detectedCity = data?.data?.address?.city || "";
            if (detectedCity) {
              dispatch(setCurrentLocation(detectedCity));
              setCity(detectedCity);
            }
          }
        } catch (err) {
          toast.error("Could not resolve city from location coordinates");
        }
      },
      (err) => {
        toast.error(`Location access denied: ${err.message}`);
      }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [activeTab, city, eventType]);

  const toggleDialog = () => setOpenDialog((prev) => !prev);

  return (
    <div className="flex flex-col">
      <div className="mt-8 flex flex-col gap-6">
        <div className="h-[1px] bg-gray-300"></div>

        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col sm:items-center sm:flex-row gap-2 ml-4">
            <span className="font-semibold text-gray-800 text-lg">
              {eventType === "onlineEvent" ? "Browsing" : "Browsing events in"}
            </span>

            <div className="relative cursor-pointer flex text-blue-600 ml-3 items-center">
              <button
                onClick={toggleDialog}
                className="font-bold flex items-center gap-1"
              >
                {eventType === "onlineEvent" ? "Online Events" : (city || "Detecting...")}
                {openDialog ? (
                  <ChevronUp className="w-5 h-5" strokeWidth={3} />
                ) : (
                  <ChevronDown className="w-5 h-5" strokeWidth={3} />
                )}
              </button>

              {openDialog && (
                <div className="absolute z-50 top-10 left-0 bg-white border border-gray-200 rounded-md shadow-lg min-w-[240px]">
                  {dialogOptions.map((val, idx) => {
                    const DialogIcon = val.icon;
                    return (
                      <div
                        onClick={() => {
                          setEventType(val.fetch);
                          if (val.fetch === "onlineEvent") {
                            setActiveTab("All"); // Reset tab visually safely
                          }
                          setOpenDialog(false);
                        }}
                        key={idx}
                        className="items-center border-b last:border-0 hover:bg-gray-100 font-semibold border-gray-200 w-full px-4 py-3 flex gap-4 transition-colors"
                      >
                        <DialogIcon className="w-5 h-5 text-gray-500" />
                        <span className="text-sm text-gray-700">{val.text}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="h-[1px] bg-gray-300"></div>
      </div>

      {/* Render tabs selection only if browsing physical city locations */}
      {eventType !== "onlineEvent" && (
        <div className="flex justify-center items-center mt-2 ml-7">
          <div className="max-w-7xl w-full">
            <ul className="flex gap-6 text-gray-500 text-sm font-semibold">
              {options.map((val, idx) => (
                <li
                  key={idx}
                  onClick={() => setActiveTab(val)}
                  className={`cursor-pointer pb-4 transition-all ${
                    activeTab === val
                      ? "border-blue-700 text-blue-700 border-b-2"
                      : "hover:text-gray-900 hover:border-b-2 hover:border-gray-900"
                  }`}
                >
                  {val}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Core Loader/Content Display Block */}
      <div className="flex items-center justify-center mt-4 ml-7 min-h-[200px]">
        {loading ? (
          <div className="w-full flex justify-center items-center py-12">
            <div className="h-10 w-10 rounded-full border-4 border-t-blue-600 border-gray-200 animate-spin"></div>
          </div>
        ) : events && events.length > 0 ? (
          <div className="w-full max-w-7xl flex gap-10 flex-wrap">
            {events.map((eve, idx) => (
              <div key={eve._id || idx}>
                <RecentEvent data={eve} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex w-full justify-center h-80 items-center">
            <div className="flex flex-col gap-4 items-center justify-center">
              <CalendarDays strokeWidth={0.7} size={80} className="text-gray-400" />
              <div className="flex flex-col justify-center items-center gap-1">
                <span className="text-lg font-semibold text-gray-800">
                  {activeTab === "For you" ? "No Events in Your Area" : "Events not found"}
                </span>
                <span className="text-sm text-gray-500">
                  {activeTab === "For you" ? "Try matching a different location" : "Check back later!"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => navigate("/searchEvent")}
        className="mt-6 px-4 text-center py-3 mx-auto min-w-[280px] rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition-colors shadow-lg hover:shadow-green-500/20"
      >
        Browse All Events
      </button>
    </div>
  );
};

export default CityEventsSection;