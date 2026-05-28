import React, { useRef, useState } from 'react'
import { getUser } from '../utils/auth'
import { IoImageOutline } from "react-icons/io5";
import { Clock3, MapPin, IndianRupee, Users, Gift } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, } from "react-leaflet";
import { marker } from 'leaflet';
import { createEvent, searchLocationForSuggesstion } from '../services/event.services';
import { useMap } from "react-leaflet";
import { LocateFixed } from 'lucide-react';
import { getCurrentLocation } from '../services/user.services';
import { IoLocationSharp } from "react-icons/io5";
import { SquarePlay } from 'lucide-react';
import { Camera, Rocket, MicVocal, Trophy, Palette, Utensils, Laptop, Tent } from 'lucide-react';
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';

function CreateEvent() {

    const currentUser = getUser();
    const navigate = useNavigate()

    if (!currentUser) {
        return null;
    }

    const categories = [
        {
            name: "Music",
            icon: MicVocal,
        },
        {
            name: "Sports",
            icon: Trophy,
        },
        {
            name: "Arts",
            icon: Palette,
        },
        {
            name: "Food",
            icon: Utensils,
        },
        {
            name: "Tech",
            icon: Laptop,
        },
        {
            name: "Outdoor",
            icon: Tent,
        },
        {
            name: "Workshops",
            icon: Camera,
        },
    ];

    const inputRef = useRef();
    const eventTitleInput = useRef();

    const [eventType, setEventType] = useState("OFFLINE");
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const [moveEventTitle, setMoveEventTitle] = useState(false);
    const [moveDescription, setMoveDescription] = useState(false);
    const [isSubmittingEvent, setIsSubmittingEvent] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        location: "",
        type: "OFFLINE",
        price: ""
    });

    const [position, setPosition] = useState({
        lat: 28.6139,
        lng: 77.2090
    });

    const [suggestions, setSuggestions] = useState([]);
    const [isSearchingLocation, setIsSearchingLocation] = useState(false);
    const [isFetchingCurrentLocation, setIsFetchingCurrentLocation] = useState(false);
    const [isEventFree, setIsEventFree] = useState(false);
    // Generate Time Slots

    const timeSlots = [];

    for (let hour = 0; hour < 24; hour++) {

        for (let min = 0; min < 60; min += 30) {

            const period = hour >= 12 ? "PM" : "AM";

            let displayHour = hour % 12;

            if (displayHour === 0) {
                displayHour = 12;
            }

            const displayMin = min.toString().padStart(2, "0");

            const time = `${displayHour}:${displayMin} ${period}`;

            timeSlots.push(time);
        }
    }

    // Handle Input Change

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });

        console.log(formData);

    };

    // Description

    const handleDescriptionChange = (e) => {

        setMoveDescription(true);

        setFormData({
            ...formData,
            description: e.target.value
        });
    };

    // Title

    const handleEventTitleChange = (e) => {

        setMoveEventTitle(true);

        setFormData({
            ...formData,
            title: e.target.value
        });
    };

    const handleEventTitleClick = () => {

        setMoveEventTitle(true);

        eventTitleInput.current.focus();
    };

    // Image Upload

    const handleClick = () => {
        inputRef.current.click();
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDragEnter = (e) => {

        e.preventDefault();

        setIsDragging(true);
    };

    const handleDragLeave = (e) => {

        e.preventDefault();

        setIsDragging(false);
    };

    const handleDrop = (e) => {

        e.preventDefault();

        setIsDragging(false);

        const file = e.dataTransfer.files[0];

        if (file) {
            formData.bannerImage = file
            setSelectedFile(file);

            const imageUrl = URL.createObjectURL(file);

            setPreview(imageUrl);
        }
    };

    const handleFileChange = (e) => {

        const file = e.target.files[0];

        if (file) {
            formData.bannerImage = file
            setSelectedFile(file);

            const imageUrl = URL.createObjectURL(file);

            setPreview(imageUrl);
        }
    };

    // Combine Date & Time

    const combineDateAndTime = (date, time) => {

        if (!date || !time) return null;

        const [timePart, modifier] = time.split(" ");

        let [hours, minutes] = timePart.split(":");

        hours = parseInt(hours);

        if (modifier === "PM" && hours !== 12) {
            hours += 12;
        }

        if (modifier === "AM" && hours === 12) {
            hours = 0;
        }

        const finalDate = new Date(date);

        finalDate.setHours(hours);
        finalDate.setMinutes(parseInt(minutes));
        finalDate.setSeconds(0);
        finalDate.setMilliseconds(0);

        return finalDate;
    };

    const validateFeild = (id, value, message) => {

        if (
            value === undefined ||
            value === null ||
            value === ""
        ) {

            toast.error(message);

            document.getElementById(id)?.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        setIsSubmittingEvent(true);

        const loadingtoast = toast.loading("creating event.....")

        const startDate = combineDateAndTime(
            formData.startDate,
            formData.startTime
        );

        const endDate = combineDateAndTime(
            formData.endDate,
            formData.endTime
        );

        formData.startDate = startDate;
        formData.endDate = endDate

        // BASIC VALIDATIONS

        if (
            !validateFeild(
                "bannerImage",
                formData.bannerImage,
                "Please provide image for event"
            )
        ) {
            setIsSubmittingEvent(false);
            toast.dismiss(loadingtoast)
            return;

        }

        if (
            !validateFeild(
                "title",
                formData.title,
                "Please provide title for event"
            )
        ) {
            setIsSubmittingEvent(false);
            toast.dismiss(loadingtoast)
            return;

        }

        if (
            !validateFeild(
                "description",
                formData.description,
                "Please provide description for event"
            )
        ) {
            setIsSubmittingEvent(false);
            toast.dismiss(loadingtoast)
            return;

        }

        if (
            !validateFeild(
                "eventType",
                formData.type,
                "Please provide a type for event"
            )
        ) {
            setIsSubmittingEvent(false);
            toast.dismiss(loadingtoast)
            return;

        }

        // ONLINE EVENT VALIDATION

        if (
            formData.type === "ONLINE" &&
            !validateFeild(
                "platform",
                formData.platform,
                "Please provide a valid platform"
            )
        ) {
            setIsSubmittingEvent(false);
            toast.dismiss(loadingtoast)
            return;

        }

        if (
            formData.type === "ONLINE" &&
            !validateFeild(
                "meetingLink",
                formData.meetingLink,
                "Please provide a valid meeting link"
            )
        ) {
            setIsSubmittingEvent(false);
            toast.dismiss(loadingtoast)
            return;

        }

        // DATE VALIDATION

        if (
            !validateFeild(
                "startDate",
                formData.startDate,
                "Please provide start date"
            )
        ) {
            setIsSubmittingEvent(false);
            toast.dismiss(loadingtoast)
            return;

        }

        if (
            !validateFeild(
                "startTime",
                formData.startTime,
                "Please provide start time"
            )
        ) {
            setIsSubmittingEvent(false);
            toast.dismiss(loadingtoast)
            return;

        }

        if (
            !validateFeild(
                "endDate",
                formData.endDate,
                "Please provide end date"
            )
        ) {
            setIsSubmittingEvent(false);
            toast.dismiss(loadingtoast)
            return;

        }

        if (
            !validateFeild(
                "endTime",
                formData.endTime,
                "Please provide end time"
            )
        ) {
            setIsSubmittingEvent(false);
            toast.dismiss(loadingtoast)
            return;

        }

        const now = new Date();

        if (startDate <= now) {

            toast.error("Start date cannot be in the past");

            document.getElementById("startDate")?.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
            setIsSubmittingEvent(false);
            toast.dismiss(loadingtoast)
            return;
        }

        if (startDate >= endDate) {

            toast.error("End date must be after start date");

            document.getElementById("endDate")?.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
            setIsSubmittingEvent(false);
            toast.dismiss(loadingtoast)
            return;
        }

        // OFFLINE EVENT VALIDATION

        if (
            formData.type === "OFFLINE" &&
            !validateFeild(
                "location",
                formData.location,
                "Please provide a valid location"
            )
        ) {
            setIsSubmittingEvent(false);
            toast.dismiss(loadingtoast)
            return;

        }

        if (
            formData.type === "OFFLINE" &&
            !validateFeild(
                "city",
                formData.city,
                "Please provide a valid city"
            )
        ) {
            setIsSubmittingEvent(false);
            toast.dismiss(loadingtoast)
            return;
        }

        if (
            formData.type === "OFFLINE" &&
            !validateFeild(
                "coordinates",
                formData.coordinates,
                "Please select event coordinates"
            )
        ) {
            setIsSubmittingEvent(false);
            toast.dismiss(loadingtoast)
            return;
        }

        // PRICE & CAPACITY VALIDATION

        const price = Number(formData.price);

        const capacity = Number(formData.capacity);

        if (
            !validateFeild(
                "price",
                price,
                "Please provide a valid price"
            )
        ) {
            setIsSubmittingEvent(false);
            toast.dismiss(loadingtoast)
            return;
        }

        if (price < 0) {

            toast.error("Price cannot be negative");

            document.getElementById("price")?.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
            setIsSubmittingEvent(false);
            toast.dismiss(loadingtoast)
            return;
        }

        if (!validateFeild("capacity", formData.capacity, "Please provide event capacity")) {
            setIsSubmittingEvent(false);
            toast.dismiss(loadingtoast)
            return;
        }

        if (capacity <= 0) {

            toast.error("Capacity must be at least 1");

            document.getElementById("capacity")?.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
            setIsSubmittingEvent(false);
            toast.dismiss(loadingtoast)
            return;
        }

        // CATEGORY VALIDATION

        if (
            !validateFeild(
                "category",
                formData.category,
                "Please select a category"
            )
        ) {
            setIsSubmittingEvent(false);
            toast.dismiss(loadingtoast)
            return;
        }

        const updatedFormData = {
            ...formData,
            startDate,
            endDate
        };

        console.log("form data after validation", updatedFormData);

        try {

            const response = await createEvent(updatedFormData);

            console.log("response from submit", response);

            toast.success("Event created successfully");
            setIsSubmittingEvent(false);

            navigate(`/eventDetails/${response.data.newEvent._id}`)

        } catch (error) {

            toast.error(
                error?.response?.data?.message ||
                "Error while creating event"
            );

            console.log(
                "error form submitting create event",
                error
            );
            setIsSubmittingEvent(false);
        }
        finally {
            toast.dismiss(loadingtoast)
        }
    };

    const LocationMarker = () => {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                setPosition({ lat, lng });
                console.log(position);

                setFormData(prev => ({
                    ...prev,
                    coordinates: {
                        lat,
                        lng
                    }
                }));
            }
        })

        return (
            <Marker position={[position.lat, position.lng]}>
                <Popup>
                    Selected Event Location
                </Popup>
            </Marker>
        )
    }

    const searchLocation = async (query) => {

        if (!query.trim()) {
            setSuggestions([]);
            return;
        }

        try {

            setIsSearchingLocation(true);

            const response = await searchLocationForSuggesstion(query);

            setSuggestions(response.data);

        } catch (error) {

            console.log("Location Search Error:", error);

        } finally {

            setIsSearchingLocation(false);
        }
    };

    const ChangeMapView = ({ center }) => {

        const map = useMap();

        map.setView(center);

        return null;
    };

    const getCurrentLocationForEvent = () => {

        if (!navigator.geolocation) {
            console.log("Geolocation not supported");
            return;
        }

        setIsFetchingCurrentLocation(true);

        navigator.geolocation.getCurrentPosition(

            async (pos) => {

                try {

                    const lat = pos.coords.latitude;
                    const lng = pos.coords.longitude;

                    const response = await getCurrentLocation(lat, lng);

                    const data = response.data;

                    setPosition({ lat, lng });

                    setFormData(prev => ({
                        ...prev,

                        location: data.display_name,

                        city:
                            data.address?.city ||
                            data.address?.town ||
                            data.address?.village ||
                            data.address?.state ||
                            data.address?.county ||
                            "",

                        coordinates: {
                            lat,
                            lng
                        }
                    }));

                } catch (error) {

                    console.log("Error fetching address:", error);

                } finally {

                    setIsFetchingCurrentLocation(false);
                }
            },

            (err) => {

                console.log("Error fetching location:", err.message);

                setIsFetchingCurrentLocation(false);
            }
        );
    }

    const handleEventTypeChange = (e) => {
        setEventType(e.currentTarget.id)
        setFormData({ ...formData, type: e.currentTarget.id })
        console.log(e.currentTarget.id);
    }

    const handlePricingTypeChange = (e) => {
        if (e.currentTarget.id == 'free') {
            setIsEventFree(true)
        }
        else {
            setIsEventFree(false)
        }
    }

    return (

        <div className='w-full min-h-screen bg-gray-100 py-10 px-4'>

            <div className='max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8'>

                {/* Heading */}

                <h1 className='text-4xl font-poppins text-gray-800 font-bold mb-10'>
                    Create an Event
                </h1>

                {/* Image Upload */}

                <div className='flex items-center justify-center'>

                    <div
                        id="bannerImage"
                        onDragOver={handleDragOver}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`
                            w-full sm:w-2/3 min-h-[320px]
                            rounded-2xl border-2 border-dashed
                            flex flex-col items-center justify-center gap-6
                            transition-all duration-300 overflow-hidden

                            ${isDragging
                                ? "border-green-600 bg-green-50 scale-[1.02] shadow-2xl shadow-green-200"
                                : "border-gray-300 bg-gray-50 hover:border-green-400 hover:bg-green-50"
                            }
                        `}
                    >

                        {
                            preview ? (

                                <div className='w-full h-full flex flex-col items-center justify-center p-6'>

                                    <img
                                        src={preview}
                                        alt="preview"
                                        className='w-full max-h-[400px] object-cover rounded-2xl shadow-lg'
                                    />

                                    <p className='mt-5 text-green-700 font-semibold text-center'>
                                        {selectedFile?.name}
                                    </p>

                                    <button
                                        onClick={handleClick}
                                        className='mt-5 px-5 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors'
                                    >
                                        Change Image
                                    </button>

                                </div>

                            ) : (

                                <>
                                    <IoImageOutline
                                        size={70}
                                        className={`
                                            transition-all duration-300
                                            ${isDragging
                                                ? "text-green-600 scale-110"
                                                : "text-gray-300"
                                            }
                                        `}
                                    />

                                    <div className='text-center'>

                                        <h3
                                            className={`
                                                text-2xl font-semibold transition-colors duration-300
                                                ${isDragging
                                                    ? "text-green-700"
                                                    : "text-gray-700"
                                                }
                                            `}
                                        >
                                            {
                                                isDragging
                                                    ? "Drop your image here"
                                                    : "Drag and drop an image"
                                            }
                                        </h3>

                                        <p className='text-sm text-gray-500 mt-2'>
                                            PNG, JPG, JPEG up to 10MB
                                        </p>

                                    </div>

                                    <div
                                        onClick={handleClick}
                                        className={`
                                            flex gap-3 items-center justify-center
                                            rounded-xl px-5 py-3 font-semibold
                                            cursor-pointer transition-all duration-300

                                            ${isDragging
                                                ? "bg-green-600 text-white shadow-lg"
                                                : "border-2 border-gray-300 hover:border-green-500 hover:text-green-700"
                                            }
                                        `}
                                    >

                                        <IoImageOutline />

                                        <p>Upload Image</p>

                                    </div>
                                </>
                            )
                        }

                        <input
                            ref={inputRef}
                            className='hidden'
                            type="file"
                            accept='image/*'
                            onChange={handleFileChange}
                        />

                    </div>

                </div>

                {/* Overview */}

                <div>

                    <h1 className='text-4xl font-poppins text-gray-800 font-bold mt-10'>
                        Overview
                    </h1>

                    <div className='w-full mt-4 hover:border-green-300 hover:shadow-md border-[2px] border-gray-300 p-4 rounded-lg'>

                        {/* Event Title */}

                        <h3 className='font-semibold mt-2 text-gray-600'>
                            Event Title
                            <sup className='text-red-600 text-xs'>*</sup>
                        </h3>

                        <p className='mt-2 text-sm text-gray-500'>
                            Be clear and descriptive with a title that tells people what your event is about.
                        </p>

                        <div
                            onClick={handleEventTitleClick}
                            className='relative cursor-text border-[1px] border-gray-300 mt-6 sm:w-1/2 p-4 rounded-lg'
                        >

                            <span
                                className={`
                                    ${moveEventTitle
                                        ? 'absolute bottom-12'
                                        : "absolute top-5"
                                    }
                                    bg-white text-xs text-gray-400
                                `}
                            >
                                Event title
                                <sup className='text-red-600 text-xs'>*</sup>
                            </span>

                            <input
                                value={formData.title}
                                onChange={handleEventTitleChange}
                                id='title'
                                ref={eventTitleInput}
                                className='outline-none w-full'
                                type="text"
                            />

                        </div>

                        {/* Description */}

                        <h3 className='font-semibold text-gray-600 mt-10'>
                            Description
                            <sup className='text-red-600 text-xs'>*</sup>
                        </h3>

                        <p className='mt-2 text-sm text-gray-500'>
                            Tell attendees what makes your event special.
                        </p>

                        <div className='relative'>

                            <span
                                className={`
                                    ${moveDescription
                                        ? "absolute top-4 left-4"
                                        : "absolute top-10 left-4"
                                    }
                                    z-10 bg-white text-xs text-gray-400
                                `}
                            >
                                Description
                                <sup className='text-red-600 text-xs'>*</sup>
                            </span>

                            <textarea
                                id="description"
                                value={formData.description}
                                onChange={handleDescriptionChange}
                                onClick={() => setMoveDescription(true)}
                                rows={3}
                                className='resize-none focus:outline-none border-[1px] border-gray-300 mt-6 sm:w-1/2 p-4 w-full rounded-lg'
                            />

                        </div>

                    </div>

                </div>

                {/* Event Type */}

                <div>
                    <h1 className='text-4xl font-poppins text-gray-800 font-bold mb-10 mt-8'>
                        Event Type
                    </h1>

                    <div id="eventType" className='w-full mt-4 hover:border-green-300 hover:shadow-md border-[2px] border-gray-300 p-6 rounded-lg'>

                        {/* Heading */}

                        <h2 className='text-xl font-semibold text-gray-800'>
                            Event Type
                        </h2>


                        <div className='mb-6'>


                            <p className='text-sm text-gray-500 mt-2 leading-6'>
                                Choose how attendees will join your event.
                                This helps us collect the right details and improves the attendee experience.
                            </p>

                        </div>

                        {/* Event Type Buttons */}

                        <div className='flex gap-4 flex-wrap'>

                            {/* ONLINE */}

                            <div id='ONLINE' onClick={handleEventTypeChange} className={`
                                   ${eventType === "ONLINE"
                                    ? "bg-green-600 text-white border-green-600"
                                    : "bg-white text-gray-700"
                                }

                                    cursor-pointer px-4 py-3 flex gap-3 items-start
                                    border-[1px] rounded-xl transition-all duration-200
                                    hover:border-green-400 hover:shadow-sm w-full sm:w-[260px]
                                `}
                            >

                                <SquarePlay size={20} className='mt-1 shrink-0' />

                                <div>

                                    <h3 className='font-semibold text-sm'>
                                        Online Event
                                    </h3>

                                    <p className='text-xs mt-1 opacity-80 leading-5'>
                                        Best for webinars, workshops, livestreams, virtual meetups,
                                        and remote sessions.
                                    </p>

                                </div>

                            </div>

                            {/* OFFLINE */}

                            <div
                                id='OFFLINE'
                                onClick={handleEventTypeChange}
                                className={`
                                    ${eventType === "OFFLINE"
                                        ? "bg-green-600 text-white border-green-600"
                                        : "bg-white text-gray-700"
                                    }

                                    cursor-pointer px-4 py-3 flex gap-3 items-start
                                    border-[1px] rounded-xl transition-all duration-200
                                    hover:border-green-400 hover:shadow-sm w-full sm:w-[260px]
                                `}
                            >

                                <IoLocationSharp size={20} className='mt-1 shrink-0' />

                                <div>

                                    <h3 className='font-semibold text-sm'>
                                        Offline Event
                                    </h3>

                                    <p className='text-xs mt-1 opacity-80 leading-5'>
                                        Perfect for concerts, conferences, meetups,
                                        exhibitions, and in-person gatherings.
                                    </p>

                                </div>

                            </div>

                        </div>

                        {/* ONLINE EVENT DETAILS */}

                        {
                            eventType === "ONLINE" && (

                                <div className='mt-8 border-t pt-6'>

                                    <div className='mb-5'>

                                        <h3 className='text-lg font-semibold text-gray-800'>
                                            Online Event Details
                                        </h3>

                                        <p className='text-sm text-gray-500 mt-2 leading-6'>
                                            These details help attendees join your event smoothly.
                                            You can share meeting links, platform information,
                                            and instructions before the event starts.
                                        </p>

                                    </div>

                                    {/* Platform */}

                                    <div className='mb-5'>

                                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                                            Streaming / Meeting Platform
                                        </label>

                                        <p className='text-xs text-gray-500 mb-3'>
                                            Select the platform attendees will use to join the event.
                                        </p>

                                        <div className='relative'>
                                            <span className='absolute left-4 top-[-8px] px-1 z-10 bg-white text-xs text-gray-400'>
                                                Platform
                                                <sup className='text-red-600 text-xs'>*</sup>
                                            </span>
                                            <select
                                                onChange={handleChange}
                                                className='w-full sm:w-1/2 p-3 border-[1px] border-gray-300 rounded-lg focus:outline-none focus:border-green-500'
                                                name="platform"
                                                id="platform"
                                            >
                                                <option value="ZOOM">Zoom</option>
                                                <option value="GOOGLE_MEET">Google Meet</option>
                                                <option value="MICROSOFT_TEAMS">Microsoft Teams</option>
                                                <option value="YOUTUBE_LIVE">YouTube Live</option>
                                                <option value="OTHER">Other</option>
                                            </select>
                                        </div>

                                    </div>

                                    {/* Meeting Link */}

                                    <div className='mb-5'>

                                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                                            Meeting / Stream Link
                                        </label>

                                        <p className='text-xs text-gray-500 mb-3'>
                                            Share the direct link attendees will use to join your event.
                                        </p>

                                        <div className='relative'>
                                            <span className='absolute left-4 top-[-8px] px-1 z-10 bg-white text-xs text-gray-400'>
                                                Link
                                                <sup className='text-red-600 text-xs'>*</sup>
                                            </span>
                                            <input
                                                onChange={handleChange}
                                                id="meetingLink"
                                                type="text"
                                                placeholder='https://meet.google.com/...'
                                                className='w-full p-3 border-[1px] border-gray-300 rounded-lg focus:outline-none focus:border-blue-500'
                                            />
                                        </div>

                                    </div>

                                    {/* Meeting ID */}

                                    <div className='mb-5'>

                                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                                            Meeting ID (Optional)
                                        </label>

                                        <p className='text-xs text-gray-500 mb-3'>
                                            Useful for platforms like Zoom or Teams where attendees may join manually.
                                        </p>

                                        <input
                                            id="meetingId"
                                            onChange={handleChange}
                                            type="text"
                                            placeholder='Enter meeting ID'
                                            className='w-full sm:w-1/2 p-3 border-[1px] border-gray-300 rounded-lg focus:outline-none focus:border-blue-500'
                                        />

                                    </div>

                                    {/* Passcode */}

                                    <div className='mb-5'>

                                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                                            Passcode (Optional)
                                        </label>

                                        <p className='text-xs text-gray-500 mb-3'>
                                            Add a passcode if your online event is protected.
                                        </p>

                                        <input
                                            id="passcode"
                                            onChange={handleChange}
                                            type="text"
                                            placeholder='Enter passcode'
                                            className='w-full sm:w-1/2 p-3 border-[1px] border-gray-300 rounded-lg focus:outline-none focus:border-blue-500'
                                        />

                                    </div>

                                    {/* Joining Instructions */}

                                    <div>

                                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                                            Joining Instructions (Optional)
                                        </label>

                                        <p className='text-xs text-gray-500 mb-3'>
                                            Help attendees prepare before joining.
                                            Example: "Please join 10 minutes early" or "Keep your microphone muted."
                                        </p>

                                        <textarea
                                            id="joiningInstructions"
                                            onChange={handleChange}
                                            rows={4}
                                            placeholder='Write instructions for attendees...'
                                            className='w-full p-3 border-[1px] border-gray-300 rounded-lg resize-none focus:outline-none focus:border-blue-500'
                                        />

                                    </div>

                                </div>
                            )
                        }

                    </div>
                </div>

                {/* Date & Location */}

                <div>

                    {/* Section Heading */}

                    <div className='mt-10'>

                        <h1 className='text-4xl font-poppins text-gray-800 font-bold'>
                            Date and Location
                        </h1>

                        <p className='text-gray-500 mt-3 max-w-3xl leading-7 text-sm sm:text-base'>
                            Let attendees know exactly when and where your event will happen.
                            Clear scheduling and accurate location details help people plan better,
                            avoid confusion, and improve attendance.
                        </p>

                    </div>

                    <div className='w-full mt-6 hover:border-green-300 hover:shadow-md border-[2px] border-gray-300 p-6 rounded-2xl transition-all duration-300'>

                        {/* DATE INFORMATION */}

                        <div className='mb-8'>

                            <h2 className='text-xl font-semibold text-gray-800'>
                                Event Schedule
                            </h2>

                            <p className='text-sm text-gray-500 mt-2 leading-6'>
                                Add the start and end date along with the timing of your event.
                                Attendees will use this information to manage reminders,
                                bookings, and availability.
                            </p>

                        </div>

                        {/* Start Date */}

                        <div className='relative'>

                            <span className='absolute left-4 top-[-8px] px-1 z-10 bg-white text-xs text-gray-400'>
                                Start Date
                                <sup className='text-red-600 text-xs'>*</sup>
                            </span>

                            <input
                                value={formData.startDate}
                                onChange={handleChange}
                                id='startDate'
                                className='p-3 border-[1px] rounded-lg text-gray-500 w-full sm:w-1/2 outline-none focus:border-green-500'
                                type="date"
                            />

                        </div>

                        {/* End Date */}

                        <div className='relative mt-5'>

                            <span className='absolute left-4 top-[-8px] px-1 z-10 bg-white text-xs text-gray-400'>
                                End Date
                                <sup className='text-red-600 text-xs'>*</sup>
                            </span>

                            <input
                                value={formData.endDate}
                                onChange={handleChange}
                                id='endDate'
                                className='p-3 border-[1px] rounded-lg text-gray-500 w-full sm:w-1/2 outline-none focus:border-green-500'
                                type="date"
                            />

                        </div>

                        {/* Time Section */}

                        <div className='mt-8'>

                            <h3 className='text-lg font-semibold text-gray-800'>
                                Event Timing
                            </h3>

                            <p className='text-sm text-gray-500 mt-2 leading-6'>
                                Choose the time attendees should join.
                                Accurate timing helps avoid delays and improves attendee experience.
                            </p>

                        </div>

                        <div className='flex gap-10 flex-wrap mt-5'>

                            {/* Start Time */}

                            <div className='relative border-[1px] p-4 gap-4 rounded-lg flex justify-between items-center w-full sm:w-[220px]'>

                                <span className='absolute left-4 top-[-9px] px-1 z-10 bg-white text-xs text-gray-400'>
                                    Start time
                                    <sup className='text-red-600 text-xs'>*</sup>
                                </span>

                                <Clock3 className='text-sm text-gray-500' size={17} />

                                <select
                                    id='startTime'
                                    value={formData.startTime}
                                    onChange={handleChange}
                                    className='text-gray-500 outline-none bg-transparent w-full'
                                >

                                    <option value="">
                                        Select
                                    </option>

                                    {
                                        timeSlots.map((time, index) => (
                                            <option key={index} value={time}>
                                                {time}
                                            </option>
                                        ))
                                    }

                                </select>

                            </div>

                            {/* End Time */}

                            <div className='relative border-[1px] p-4 gap-4 rounded-lg flex justify-between items-center w-full sm:w-[220px]'>

                                <span className='absolute left-4 top-[-9px] px-1 z-10 bg-white text-xs text-gray-400'>
                                    End time
                                    <sup className='text-red-600 text-xs'>*</sup>
                                </span>

                                <Clock3 className='text-sm text-gray-500' size={17} />

                                <select
                                    id='endTime'
                                    value={formData.endTime}
                                    onChange={handleChange}
                                    className='text-gray-500 outline-none bg-transparent w-full'
                                >

                                    <option value="">
                                        Select
                                    </option>

                                    {
                                        timeSlots.map((time, index) => (
                                            <option key={index} value={time}>
                                                {time}
                                            </option>
                                        ))
                                    }

                                </select>

                            </div>

                        </div>

                        {/* OFFLINE LOCATION SECTION */}

                        {
                            eventType === "OFFLINE" &&

                            <div className='mt-10'>

                                {/* Location Heading */}

                                <div className='mb-6'>

                                    <h2 className='text-xl font-semibold text-gray-800'>
                                        Event Location
                                    </h2>

                                    <p className='text-sm text-gray-500 mt-2 leading-6'>
                                        Provide the exact venue or address where your event will take place.
                                        Attendees will use this information for navigation and travel planning.
                                    </p>

                                </div>

                                <div className='relative sm:w-1/2'>

                                    <MapPin
                                        className='absolute left-4 top-4 text-gray-400'
                                        size={18}
                                    />

                                    <input
                                        id='location'
                                        value={formData.location}
                                        onChange={(e) => {

                                            handleChange(e);

                                            searchLocation(e.target.value);
                                        }}
                                        type="text"
                                        placeholder='Search event venue or address'
                                        className='w-full border-[1px] border-gray-300 rounded-lg py-3 pl-12 pr-4 outline-none focus:border-green-500'
                                    />

                                    {/* Current Location Button */}

                                    <div
                                        onClick={!isFetchingCurrentLocation ? getCurrentLocationForEvent : null}
                                        className='flex items-center rounded-lg hover:bg-gray-100 cursor-pointer gap-4 border-[1px] p-4 border-gray-300 mt-6 mb-4 transition-all duration-200'
                                    >

                                        <LocateFixed className='text-gray-500' />

                                        <span className='font-poppins text-xs text-gray-700'>
                                            {
                                                isFetchingCurrentLocation
                                                    ? "Fetching Location..."
                                                    : "Use my Current Location"
                                            }
                                        </span>

                                    </div>

                                    {/* Loading */}

                                    {
                                        isSearchingLocation && (

                                            <div className='absolute z-[1000] bg-white border border-gray-300 w-full rounded-xl mt-2 shadow-lg p-4 text-sm text-gray-500'>
                                                Searching locations...
                                            </div>
                                        )
                                    }

                                    {/* Suggestions */}

                                    {
                                        suggestions.length > 0 && (

                                            <div className='absolute z-[1000] bg-white border border-gray-300 w-full rounded-xl mt-2 shadow-lg max-h-[250px] overflow-y-auto'>

                                                {
                                                    suggestions.map((place, index) => (

                                                        <div
                                                            key={index}
                                                            onClick={() => {

                                                                const lat = parseFloat(place.lat);
                                                                const lng = parseFloat(place.lon);

                                                                setPosition({ lat, lng });

                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    location: place.display_name,

                                                                    city:
                                                                        place.address?.city ||
                                                                        place.address?.town ||
                                                                        place.address?.village ||
                                                                        place.address?.state ||
                                                                        place.address?.county ||
                                                                        "",

                                                                    coordinates: {
                                                                        lat,
                                                                        lng
                                                                    }
                                                                }));

                                                                setSuggestions([]);
                                                            }}
                                                            className='p-3 hover:bg-gray-100 cursor-pointer text-sm'
                                                        >

                                                            {place.display_name}

                                                        </div>
                                                    ))
                                                }

                                            </div>
                                        )
                                    }

                                    {/* Map */}

                                    <div className='mt-6 rounded-2xl overflow-hidden border border-gray-300'>

                                        <MapContainer
                                            center={[position.lat, position.lng]}
                                            zoom={10}
                                            zoomControl={false}
                                            scrollWheelZoom={true}
                                            className='h-[400px] w-full'
                                        >

                                            <ChangeMapView center={[position.lat, position.lng]} />

                                            <TileLayer
                                                attribution='&copy; OpenStreetMap contributors'
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            />

                                            <LocationMarker />

                                        </MapContainer>

                                    </div>

                                    <p className='text-xs text-gray-500 mt-3 leading-5'>
                                        You can search for a location, use your current location,
                                        or manually select a point on the map.
                                    </p>

                                </div>

                            </div>
                        }

                    </div>

                </div>

                {/* Price and Capacity */}

                <div>
                    <h1 className='text-4xl font-poppins text-gray-800 font-bold mb-2 mt-10'>
                        Price & Capacity
                    </h1>

                    <p className='text-sm text-gray-500 mt-2 leading-6 max-w-3xl'>
                        Set your ticket pricing and attendee limit carefully.
                        Clear pricing helps attendees decide faster, while capacity
                        ensures you can manage crowd size, seating, and overall event experience smoothly.
                    </p>

                    <div className='w-full mt-6 hover:border-green-300 hover:shadow-md border-[2px] border-gray-300 p-6 rounded-2xl transition-all duration-300'>

                        {/* Price */}

                        <div>
                            <div className='flex gap-4 flex-wrap'>

                                {/* FREE EVENT */}

                                <div
                                    id='free'
                                    onClick={handlePricingTypeChange}
                                    className={`
                                        ${isEventFree === true
                                            ? "bg-green-600 text-white border-green-600"
                                            : "bg-white text-gray-700"
                                        }

                                        cursor-pointer px-4 py-3 flex gap-3 items-start
                                        border-[1px] rounded-xl transition-all duration-200
                                        hover:border-green-400 hover:shadow-sm w-full sm:w-[260px]
                                    `}
                                >

                                    <Gift size={20} className='mt-1 shrink-0' />

                                    <div>

                                        <h3 className='font-semibold text-sm'>
                                            Free Event
                                        </h3>

                                        <p className='text-xs mt-1 opacity-80 leading-5'>
                                            Great for community meetups, open workshops,
                                            awareness programs, and events where attendees
                                            can join without purchasing tickets.
                                        </p>

                                    </div>

                                </div>

                                {/* PAID EVENT */}

                                <div
                                    id='paid'
                                    onClick={handlePricingTypeChange}

                                    className={`
                                        ${isEventFree === false
                                            ? "bg-green-600 text-white border-green-600"
                                            : "bg-white text-gray-700"
                                        }

                                        cursor-pointer px-4 py-3 flex gap-3 items-start
                                        border-[1px] rounded-xl transition-all duration-200
                                        hover:border-green-400 hover:shadow-sm w-full sm:w-[260px]
                                    `}
                                >

                                    <IndianRupee size={20} className='mt-1 shrink-0' />

                                    <div>

                                        <h3 className='font-semibold text-sm'>
                                            Paid Event
                                        </h3>

                                        <p className='text-xs mt-1 opacity-80 leading-5'>
                                            Ideal for premium workshops, concerts,
                                            conferences, training sessions, and events
                                            that require ticket purchases for entry.
                                        </p>

                                    </div>

                                </div>

                            </div>
                            <h3 className='mt-10 text-lg font-semibold text-gray-800'>
                                Ticket Price
                                <sup className='text-red-500 text-xs'>*</sup>
                            </h3>

                            <p className='text-sm text-gray-500 mt-1 leading-6'>
                                Enter the price attendees need to pay for one ticket.
                                Use <span className='font-medium'>0</span> if your event is free.
                            </p>

                            <div className='mt-4 relative w-full sm:w-1/2'>
                                <IndianRupee
                                    size={18}
                                    className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-500'
                                />

                                <input
                                    id='price'
                                    type="number"
                                    min="0"
                                    disabled={isEventFree}
                                    value={isEventFree === true ? 0 : formData.price}
                                    onChange={handleChange}
                                    placeholder='Enter ticket price'
                                    className='w-full border-[1px] border-gray-300 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-green-500 text-gray-700'
                                />
                            </div>
                        </div>

                        {/* Capacity */}

                        <div className='mt-8'>
                            <h3 className='text-lg font-semibold text-gray-800'>
                                Event Capacity
                                <sup className='text-red-500 text-xs'>*</sup>
                            </h3>

                            <p className='text-sm text-gray-500 mt-1 leading-6'>
                                Define the maximum number of attendees allowed for this event.
                                This helps manage bookings and prevents over-registration.
                            </p>

                            <div className='mt-4 relative w-full sm:w-1/2'>
                                <Users
                                    size={18}
                                    className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-500'
                                />

                                <input
                                    id='capacity'
                                    type="number"
                                    min="1"
                                    value={formData.capacity}
                                    onChange={handleChange}
                                    placeholder='Maximum attendees'
                                    className='w-full border-[1px] border-gray-300 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-green-500'
                                />
                            </div>
                        </div>


                    </div>
                </div>



                {/* CATEGORY SECTION */}

                <div>

                    <h1 className='text-4xl font-poppins text-gray-800 font-bold mb-2 mt-10'>
                        Event Category
                    </h1>

                    <p className='text-sm text-gray-500 mt-2 leading-6 max-w-3xl'>
                        Choose the category that best describes your event.
                        Categories help attendees discover events faster and improve recommendations across the platform.
                    </p>

                    <div className='w-full mt-6 hover:border-green-300 hover:shadow-md border-[2px] border-gray-300 p-6 rounded-2xl transition-all duration-300'>

                        <div id="category" className='flex flex-wrap gap-5'>

                            {
                                categories.map((category, idx) => {

                                    const Icon = category.icon;

                                    return (

                                        <div
                                            key={idx}
                                            onClick={() =>
                                                setFormData(prev => ({
                                                    ...prev,
                                                    category: category.name
                                                }))
                                            }
                                            className={`
                                                cursor-pointer transition-all duration-200
                                                border-[1px] rounded-2xl p-5
                                                flex flex-col items-center justify-center
                                                gap-3 w-[130px] h-[130px]
                                                ${formData.category === category.name
                                                    ? "bg-green-600 text-white border-green-600 shadow-lg scale-[1.03]"
                                                    : "bg-white text-gray-700 border-gray-300 hover:border-green-400 hover:bg-green-50"
                                                }
                                            `}
                                        >

                                            <div className={` rounded-full p-4 transition-all duration-200

                                                ${formData.category === category.name
                                                    ? "bg-white/20"
                                                    : "bg-gray-100"
                                                }
                                            `}
                                            >
                                                <Icon size={28} strokeWidth={1.8} />
                                            </div>

                                            <span className='text-sm font-semibold text-center'>
                                                {category.name}
                                            </span>

                                        </div>
                                    );
                                })
                            }

                        </div>



                    </div>

                </div>

                <div className='mt-10 flex justify-center'>

                    <button disabled={isSubmittingEvent} onClick={handleSubmit} className=' px-8 py-3 rounded-xl  bg-green-600 text-white font-semibold font-poppins transition-all duration-200  hover:bg-green-700 hover:shadow-md active:scale-95 ' >
                        {isSubmittingEvent === true ? "Submitting" : "Publish Event"}
                    </button>
                </div>
            </div>

        </div>
    )
}

export default CreateEvent