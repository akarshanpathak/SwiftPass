import React, { useRef, useState, useEffect } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  MicVocal,
  Trophy,
  Palette,
  Utensils,
  Laptop,
  Tent,
  Camera,
  MapPin,
  CalendarDays,
  IndianRupee,
  ChevronRight,
  ChevronLeft,
  Wifi,
  MapPinned,
} from "lucide-react";
import { fetchAllEvent } from "../services/event.services";
import { useLocation, useNavigate } from "react-router-dom";

const CATEGORIES = [
  { name: "Music", icon: MicVocal },
  { name: "Sports", icon: Trophy },
  { name: "Arts", icon: Palette },
  { name: "Food", icon: Utensils },
  { name: "Tech", icon: Laptop },
  { name: "Outdoor", icon: Tent },
  { name: "Workshops", icon: Camera },
];

const DATE_OPTIONS = ["Today", "Tomorrow", "This Weekend"];
const PRICE_OPTIONS = ["Free", "Paid"];
const TYPE_OPTIONS = [
  { value: "ONLINE", label: "Online", icon: Wifi },
  { value: "OFFLINE", label: "In-Person", icon: MapPinned },
];

const SORT_OPTIONS = [
  { value: "", label: "Date (Soonest)" },
  { value: "priceLow", label: "Price: Low to High" },
  { value: "priceHigh", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
];

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function EventCard({ event, onClick }) {
  return (
    <div
      onClick={onClick}
      className="group flex gap-4 p-4 rounded-xl border border-gray-100 bg-white hover:border-green-200 hover:shadow-sm transition-all cursor-pointer"
    >
      <div className="w-24 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
        {event.bannerImage ? (
          <img src={event.bannerImage} alt={event.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-green-50">
            <CalendarDays size={24} className="text-green-300" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-800 text-sm leading-snug line-clamp-2 group-hover:text-green-700 transition-colors">
            {event.title}
          </h3>
          <ChevronRight size={16} className="text-gray-300 flex-shrink-0 mt-0.5 group-hover:text-green-500 transition-colors" />
        </div>

        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
          {event.city && (
            <span className="flex items-center gap-1">
              <MapPin size={11} />
              {event.city}
            </span>
          )}
          {event.startDate && (
            <span className="flex items-center gap-1">
              <CalendarDays size={11} />
              {formatDate(event.startDate)}
            </span>
          )}
        </div>

        <div className="mt-2 flex items-center gap-2">
          <span className="flex items-center gap-0.5 text-sm font-medium text-gray-800">
            {event.price === 0 ? (
              <span className="text-green-600 font-semibold text-xs px-2 py-0.5 bg-green-50 rounded-full">
                Free
              </span>
            ) : (
              <>
                <IndianRupee size={13} />
                {event.price}
              </>
            )}
          </span>
          {event.category && (
            <span className="ml-auto text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full border">
              {event.category}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterPanel({ filters, setFilters, onApply, onClose, loading }) {
  const dateInputRef = useRef(null);

  const toggle = (key, value) =>
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? "" : value,
    }));

  return (
    <div className="mt-4 border border-gray-200 rounded-2xl p-5 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-semibold text-gray-800">Filters</h2>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
          <X size={18} className="text-gray-500" />
        </button>
      </div>

      {/* Category */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Category</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {CATEGORIES.map(({ name, icon: Icon }) => (
            <button
              key={name}
              onClick={() => toggle("category", name)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm transition-all ${
                filters.category === name
                  ? "border-green-600 bg-green-50 text-green-700 font-medium"
                  : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <Icon size={15} />
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Date */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Date</h3>
        <div className="flex flex-wrap gap-2">
          {DATE_OPTIONS.map((item) => (
            <button
              key={item}
              onClick={() => toggle("date", item)}
              className={`px-4 py-2 rounded-full border text-sm transition-all ${
                filters.date === item
                  ? "border-green-600 bg-green-50 text-green-700 font-medium"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {item}
            </button>
          ))}
          <button
            onClick={() => dateInputRef.current?.showPicker?.()}
            className={`px-4 py-2 rounded-full border text-sm transition-all ${
              filters.date && !DATE_OPTIONS.includes(filters.date)
                ? "border-green-600 bg-green-50 text-green-700 font-medium"
                : "border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            {filters.date && !DATE_OPTIONS.includes(filters.date) ? filters.date : "Pick Date"}
          </button>
          <input
            ref={dateInputRef}
            type="date"
            className="sr-only"
            onChange={(e) => setFilters((prev) => ({ ...prev, date: e.target.value }))}
          />
        </div>
      </div>

      {/* Type */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Event Type</h3>
        <div className="flex gap-2">
          {TYPE_OPTIONS.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => toggle("type", value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm transition-all ${
                filters.type === value
                  ? "border-green-600 bg-green-50 text-green-700 font-medium"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Price</h3>
        <div className="flex gap-2">
          {PRICE_OPTIONS.map((item) => (
            <button
              key={item}
              onClick={() => toggle("price", item)}
              className={`px-4 py-2 rounded-full border text-sm transition-all ${
                filters.price === item
                  ? "border-green-600 bg-green-50 text-green-700 font-medium"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Sort By</h3>
        <select
          value={filters.sort}
          onChange={(e) => setFilters((prev) => ({ ...prev, sort: e.target.value }))}
          className="w-full sm:w-48 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:border-green-500 bg-white"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-3 pt-2 border-t border-gray-100">
        <button
          onClick={onApply}
          disabled={loading}
          className="px-5 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-60"
        >
          {loading ? "Searching..." : "Apply"}
        </button>
        <button
          onClick={() => setFilters({ category: "", date: "", price: "", sort: "", search: "", type: "", city: "" })}
          className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50 transition-colors"
        >
          Clear all
        </button>
      </div>
    </div>
  );
}

function ActiveFilters({ filters, setFilters }) {
  const chips = [];
  if (filters.type) {
    const t = TYPE_OPTIONS.find((o) => o.value === filters.type);
    if (t) chips.push({ key: "type", label: t.label });
  }
  if (filters.category) chips.push({ key: "category", label: filters.category });
  if (filters.city) chips.push({ key: "city", label: `📍 ${filters.city}` });
  if (filters.date) chips.push({ key: "date", label: filters.date });
  if (filters.price) chips.push({ key: "price", label: filters.price });
  if (filters.sort) {
    const s = SORT_OPTIONS.find((o) => o.value === filters.sort);
    if (s) chips.push({ key: "sort", label: s.label });
  }

  if (!chips.length) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {chips.map(({ key, label }) => (
        <span
          key={key}
          className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-medium"
        >
          {label}
          <button onClick={() => setFilters((p) => ({ ...p, [key]: "" }))}>
            <X size={12} />
          </button>
        </span>
      ))}
    </div>
  );
}

export default function SearchEvent() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showFilters, setShowFilters] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    category: location.state?.category || "",
    date: "",
    price: "",
    sort: "",
    search: location.state?.q || "", 
    type: "",
    city: location.state?.city || "",     
  });

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (location.state) {
      setFilters((prev) => ({
        ...prev,
        search: location.state.q !== undefined ? location.state.q : prev.search,
        city: location.state.city !== undefined ? location.state.city : prev.city,
        category: location.state.category !== undefined ? location.state.category : prev.category,
      }));
      
      const timer = setTimeout(() => fetchEvents(1), 0);
      return () => clearTimeout(timer);
    }
  }, [location.state]); 
  
  useEffect(() => {
    fetchEvents(1);
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!filters.search.trim()) return;
    const timeout = setTimeout(() => fetchEvents(1), 600);
    return () => clearTimeout(timeout);
  }, [filters.search]);

  const buildQuery = (page = 1) => {
    const params = new URLSearchParams();
    if (filters.search.trim()) params.append("q", filters.search.trim());
    if (filters.category) params.append("category", filters.category);
    if (filters.sort) params.append("sort", filters.sort);
    if (filters.type) params.append("type", filters.type);
    if (filters.city) params.append("city", filters.city);
    if (filters.price === "Free") params.append("isFree", "true");
    else if (filters.price === "Paid") params.append("minPrice", "1");
    if (filters.date === "Today") params.append("today", "true");
    else if (filters.date === "Tomorrow") params.append("tomorrow", "true");
    else if (filters.date === "This Weekend") params.append("thisWeekend", "true");
    else if (filters.date && !DATE_OPTIONS.includes(filters.date))
      params.append("specificDate", filters.date);
    params.append("page", String(page));
    params.append("limit", "10");
    return params.toString();
  };

  const fetchEvents = async (page = 1) => {
    try {
      setLoading(true);
      setError("");
      const query = buildQuery(page);
      const res = await fetchAllEvent(query);
      const data = res.data;
      setEvents(data.events);
      setPagination(data.pagination);
      setCurrentPage(page);
      setSearched(true);
      setShowFilters(false);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToEventDetail = (event) => {
    navigate(`/eventDetails/${event._id}`);
  };

  const handleSearchKey = (e) => {
    if (e.key === "Enter") fetchEvents(1);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Explore Events</h1>
        <p className="mt-1 text-gray-500 text-sm">Find events happening around you</p>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, tag, or keyword…"
            value={filters.search}
            onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
            onKeyDown={handleSearchKey}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-500 transition-colors bg-white"
          />
        </div>

        <button
          onClick={() => setShowFilters((v) => !v)}
          className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-medium transition-all ${
            showFilters
              ? "border-green-600 bg-green-50 text-green-700"
              : "border-gray-200 text-gray-600 hover:border-gray-300 bg-white"
          }`}
        >
          <SlidersHorizontal size={15} />
          <span className="hidden sm:inline">Filters</span>
        </button>

        <button
          onClick={() => fetchEvents(1)}
          disabled={loading}
          className="px-5 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-60"
        >
          {loading ? "…" : "Search"}
        </button>
      </div>

      <ActiveFilters filters={filters} setFilters={setFilters} />

      {showFilters && (
        <FilterPanel
          filters={filters}
          setFilters={setFilters}
          onApply={() => fetchEvents(1)}
          onClose={() => setShowFilters(false)}
          loading={loading}
        />
      )}

      <div className="mt-6">
        {error && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        {loading && (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {!loading && searched && events.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <CalendarDays size={36} className="mx-auto mb-3 opacity-40" />
            <p className="font-medium text-gray-600">No events found</p>
            <p className="text-sm mt-1">Try different keywords or filters</p>
          </div>
        )}

        {!loading && events.length > 0 && (
          <>
            <p className="text-xs text-gray-400 mb-3">
              {pagination?.totalEvent ?? events.length} event
              {(pagination?.totalEvent ?? events.length) !== 1 ? "s" : ""} found
            </p>

            <div className="space-y-3">
              {events.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  onClick={() => handleNavigateToEventDetail(event)}
                />
              ))}
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between gap-2">
                <button
                  onClick={() => fetchEvents(currentPage - 1)}
                  disabled={!pagination.hasPrevPage || loading}
                  className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={15} />
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter(
                      (p) =>
                        p === 1 ||
                        p === pagination.totalPages ||
                        Math.abs(p - currentPage) <= 1
                    )
                    .reduce((acc, p, idx, arr) => {
                      if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, idx) =>
                      p === "..." ? (
                        <span key={`dot-${idx}`} className="px-1 text-gray-400 text-sm">…</span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => fetchEvents(p)}
                          disabled={loading}
                          className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                            p === currentPage
                              ? "bg-green-600 text-white"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {p}
                        </button>
                      )
                    )}
                </div>

                <button
                  onClick={() => fetchEvents(currentPage + 1)}
                  disabled={!pagination.hasNextPage || loading}
                  className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Next
                  <ChevronRight size={15} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}