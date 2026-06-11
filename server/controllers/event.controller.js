import asyncHandler from "../utils/asyncHandler.js";
import { Event } from "../models/event.schema.js";
import ApiError from "../utils/ApiError.js";
import mongoose from "mongoose";
import { deleteImageFromCloudinary } from "../config/cloudinary.js";

export const createEvent = asyncHandler(async (req, res, next) => {
  console.log("in create event server side");
  console.log("1");

  const {
    title,
    description,
    type,
    startDate,
    endDate,
    price,
    capacity,
    platform,
    location,
    city,
    meetingLink,
    coordinates,
    category,
  } = req.body;

  if (type === "OFFLINE" && (!location || !city || !coordinates)) {
    console.log("3");

    throw new ApiError(400, "please provide valid location");
  }
  console.log("4");

  if (type === "ONLINE" && (!platform || !meetingLink)) {
    console.log(platform, meetingLink);

    throw new ApiError(400, "please provide valid platform and meeting link");
  }
  console.log("5");

  if (!title || !description || !startDate || !endDate || !price || !capacity) {
    console.log("6");
    console.log(title);
    console.log(description);
    console.log(startDate);
    console.log(endDate);
    console.log(price);
    console.log(capacity);

    throw new ApiError(400, "Please Provide all required feilds");
  }
  console.log("7");

  if (!req.file) {
    console.log("re.file", req.file);
    console.log("3");
    throw new ApiError(400, "Banner image is required");
  }
  console.log("3");
  // console.log(req.file);
  console.log("3");
  if (price === undefined) {
    console.log("3");
    throw new ApiError(400, "Price is required");
  }
  console.log("3");
  if (price < 0) {
    console.log("3");
    throw new ApiError(400, "Price cannot be negative");
  }

  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (end <= start) {
    throw new ApiError(400, "End Date must be after Start Date");
  }

  if (start < now) {
    throw new ApiError(400, "Start date can't be of past");
  }

  if (capacity <= 0) {
    throw new ApiError(400, "Capacity must be at least 1");
  }

  // city = city.toLowerCase();
  const newEvent = new Event({
    title,
    description,
    bannerImage: req.file.path,
    bannerImagePublicId: req.file.filename,
    type,
    price,
    location,
    capacity,
    startDate,
    endDate,
    platform,
    category,
    meetingLink,
    coordinates,
    organiserId: req.user._id,
    city: city.toLowerCase(),
  });

  await newEvent.save();

  res
    .status(201)
    .json({ message: "Event Created Successfully", success: true, newEvent });
});

export const getAllEvent = asyncHandler(async (req, res, next) => {
  const events = await Event.find({
    status: "PUBLISHED",
    date: {
      $gte: new Date(),
    },
  })
    .populate("organiserId", "name avatar")
    .sort({ startDate: 1 });

  res.status(201).json({
    message: "Event fetched successfully",
    success: true,
    data: events,
    count: events.length,
  });
});

export const getEventById = asyncHandler(async (req, res, next) => {
  const id = req.params.eventId;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Event ID format");
  }

  const event = await Event.findById(id).populate("organiserId", "name avatar");

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  res.status(200).json({
    message: "Event fetched Successfully",
    success: true,
    data: event,
  });
});

export const getAllEventForUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid User ID format");
  }

  const events = await Event.find({ organiserId: userId });

  if (events.length === 0) {
    return res.status(200).json({
      success: true,
      message: "No events found for this user",
      data: [],
    });
  }

  res.status(200).json({
    message: "Event fetched Successfully",
    Length: events.length,
    success: true,
    data: events,
  });
});

export const updateEventsDetail = asyncHandler(async (req, res) => {
  const eventId = req.params.eventId;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    throw new ApiError(400, "Invalid Event ID format");
  }

  const event = await Event.findById(eventId);

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  const userId = req.user._id;

  if (userId.toString() !== event.organiserId.toString()) {
    throw new ApiError(
      400,
      "You are only allowed to update events created by you.",
    );
  }

  const updates = req.body;

  if (req.file) {
    const publicId = event.bannerImagePublicId;
    await deleteImageFromCloudinary(publicId);
    updates.bannerImage = req.file.path;
    updates.bannerImagePublicId = req.file.filename;
  }

  if (updates.price && event.ticketSold > 0) {
    throw new ApiError(
      400,
      `You are not allowed to change price as ${event.ticketSold} tickets have already sold`,
    );
  }

  if (updates.capacity && updates.capacity < event.ticketSold) {
    throw new ApiError(400, "Capacity can't be less than sold tickets");
  }

  const currDate = new Date();

  const checkStart = updates.startDate
    ? new Date(updates.startDate)
    : new Date(event.startDate);
  const checkEnd = updates.endDate
    ? new Date(updates.endDate)
    : new Date(event.endDate);

  if (updates.startDate && checkStart < currDate) {
    throw new ApiError(400, "Start date cannot be in the past");
  }

  if (checkEnd <= checkStart) {
    throw new ApiError(400, "End date must be after the Start date");
  }

  const restrictedFields = ["_id", "organiserId", "ticketSold"];

  restrictedFields.forEach((feild) => delete updates[feild]);

  const updatedEvent = await Event.findByIdAndUpdate(
    eventId,
    { $set: updates },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).json({
    message: "Event details have been updated successfully",
    success: true,
    data: updatedEvent,
  });
});

export const changeEventStatus = asyncHandler(async (req, res) => {
  const eventId = req.params.eventId;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    throw new ApiError(400, "Invalid Event ID format");
  }

  const event = await Event.findById(eventId);

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  const userId = req.user._id;

  if (userId.toString() !== event.organiserId.toString()) {
    throw new ApiError(
      400,
      "You are only allowed to update events created by you.",
    );
  }

  const { status } = req.body;

  if (!status) {
    throw new ApiError(400, "Status is required");
  }

  const validStatuses = ["DRAFT", "PUBLISHED", "SOLD_OUT", "COMPLETED"];

  if (!validStatuses.includes(status.toUpperCase())) {
    throw new ApiError(400, "Invalid status value");
  }

  if (status.toUpperCase() === "PUBLISHED") {
    if (!event.bannerImage) {
      throw new ApiError(
        400,
        "Cannot publish event without a banner image and location",
      );
    }
  }

  if (event.status === "COMPLETED" && status.toUpperCase() !== "COMPLETED") {
    throw new ApiError(
      400,
      "Cannot change status of an event that has already ended.",
    );
  }

  event.status = status.toUpperCase();
  await event.save();

  res.status(200).json({
    success: true,
    message: `Event status updated to ${event.status}`,
    data: { status: event.status, event },
  });
});

export const getAllForLocation = asyncHandler(async (req, res, next) => {
  const { location } = req.query;
  if (!location) {
    throw new ApiError(400, "Location is required");
  }
  const events = await Event.find({
    location,
    date: {
      $gte: new Date(),
    },
  });
  if (events.length <= 0) {
    res.status(200).json({ message: "No event found for this location" });
    return;
  }

  res
    .status(200)
    .json({ message: "Event found for this location", data: events });
});

export const onlineEvent = asyncHandler(async (req, res, next) => {
  const events = await Event.find({ type: "ONLINE" });
  if (events.length <= 0) {
    res.status(200).json({ message: "No event found" });
    return;
  }

  res.status(200).json({ message: "Event found", data: events });
});

export const recentEvent = asyncHandler(async (req, res, next) => {
  const events = await Event.find().sort({ createdAt: -1 }).limit(9);
  if (events.length <= 0) {
    res.status(200).json({ message: "No event found" });
    return;
  }

  res.status(200).json({ message: "Event found", data: events });
});

export const todaysEvent = asyncHandler(async (req, res, next) => {
  const { location } = req.query;
  if (!location) {
    throw new ApiError(400, "Add location to fetch todays event");
  }

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  const events = await Event.find({
    startDate: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
    city: location.toLowerCase(),
  });

  console.log(events);

  if (events.length > 0) {
    res.status(201).json({ events, message: "Event find successfully" });
  } else {
    res.status(201).json({ events, message: "No event found" });
  }
});

export const thisWeekend = asyncHandler(async (req, res, next) => {
  const { location } = req.query;

  if (!location) {
    throw new ApiError(400, "Add location to fetch event");
  }

  const startOfWeekend = new Date();
  const dateDiff = (6 - startOfWeekend.getDate() + 7) % 7;
  startOfWeekend.setDate(new Date().getDate + dateDiff);
  startOfWeekend.setHours(0, 0, 0, 0);

  const endOfWeekend = new Date();
  endOfWeekend.setDate(startOfWeekend.getDate() + 1);
  startOfWeekend.setHours(23, 59, 59, 999);

  const event = await Event.find({
    location: { $regex: location, $options: "i" },
    date: {
      $gte: startOfWeekend,
      $lte: endOfWeekend,
    },
  });

  if (event.length <= 0) {
    return res
      .status(201)
      .json({ message: "No event found for this location", success: true });
  }

  res
    .status(201)
    .json({ message: "Event found for this location", success: true, event });
  return;
});
// add delete Event route

export const searchLocation = asyncHandler(async (req, res, next) => {
  const { query } = req.query;

  if (!query) {
    throw new ApiError(404, "All feilds are required");
  }

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1 `,
    {
      headers: {
        "User-Agent": "EventPlatform/1.0",
      },
    },
  );

  const data = await response.json();

  res.json(data);
});

export const totalNumberOfEventOrganisedByUser = asyncHandler(
  async (req, res, next) => {
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new ApiError(400, "Invalid User ID format");
    }

    const events = await Event.find({ organiserId: userId });
    res.status(200).json({
      message: "Event fetched Successfully",
      eventCount: events.length,
      success: true,
    });
  },
);

export const searchEvents = asyncHandler(async (req, res, next) => {
  const {
    q,
    type,
    isFree,
    maxPrice,
    minPrice,
    category,
    city,
    organiserId,
    today,
    thisWeekend,
    tomorrow,
    specificDate, // Added distance in KM
    sort,
    page,
    limit,
  } = req.query;

  let queryObj = { status: "PUBLISHED" };

  if (q) {
    queryObj.$or = [
      { title: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } },
      { tags: { $in: [new RegExp(q, "i")] } },
    ];
  }

  if (type && type !== "ALL") queryObj.type = type;

  if (category && category !== "ALL") queryObj.category = category;

  if (city) queryObj.city = { $regex: city, $options: "i" };

  if (organiserId) queryObj.organiserId = organiserId;

  if (isFree === "true") {
    
    queryObj.price = 0;

  } else if (minPrice || maxPrice) {
    queryObj.price = {};

    if (minPrice) queryObj.price.$gte = Number(minPrice);

    if (maxPrice) queryObj.price.$lte = Number(maxPrice);
  }

  let dateQuery = {};

  if (today === "true") {

    const start = new Date();

    start.setHours(0, 0, 0, 0);

    const end = new Date();

    end.setHours(23, 59, 59, 999);
    
    dateQuery = { $gte: start, $lte: end };

  } else if (tomorrow === "true") {
    const start = new Date();

    start.setDate(start.getDate() + 1);

    start.setHours(0, 0, 0, 0);

    const end = new Date();

    end.setDate(end.getDate() + 1);

    end.setHours(23, 59, 59, 999);

    dateQuery = { $gte: start, $lte: end };

  } else if (thisWeekend === "true") {
    const todayDate = new Date();

    const dayOfWeek = todayDate.getDay(); // 0 (Sun) to 6 (Sat)

    const distToFriday = (5 - dayOfWeek + 7) % 7;

    const friday = new Date();

    friday.setDate(todayDate.getDate() + distToFriday);

    friday.setHours(18, 0, 0, 0); // Weekend starts Friday evening

    const distToSunday = (0 - dayOfWeek + 7) % 7;

    const sunday = new Date();

    sunday.setDate(todayDate.getDate() + distToSunday);

    sunday.setHours(23, 59, 59, 999);

    dateQuery = { $gte: friday, $lte: sunday };
  } else if (specificDate) {

    const start = new Date(specificDate);

    start.setHours(0, 0, 0, 0);

    const end = new Date(specificDate);

    end.setHours(23, 59, 59, 999);

    dateQuery = { $gte: start, $lte: end };

  } else {

    dateQuery = { $gte: new Date() };
    
  }
  queryObj.startDate = dateQuery;

  const pageNum = Math.abs(Number(page)) || 1;

  let limitNum = Math.abs(Number(limit)) || 10;

  limitNum = Math.min(limitNum, 50); 

  const skip = (pageNum - 1) * limitNum;

  let sortOptions = { startDate: 1 };
  if (sort === "priceLow") sortOptions = { price: 1 };

  if (sort === "priceHigh") sortOptions = { price: -1 };

  if (sort === "newest") sortOptions = { createdAt: -1 };


  const events = await Event.find(queryObj)
    .select(
      "title bannerImage price startDate city type category organiserId status",
    )
    .sort(sortOptions)
    .skip(skip)
    .limit(limitNum)
    .populate("organiserId", "name avatar")
    .lean();

  const totalEvent = await Event.countDocuments(queryObj);
  const totalPages = Math.ceil(totalEvent / limitNum);

  res.status(200).json({
    success: true,
    results: events.length,
    pagination: {
      totalEvent,
      totalPages,
      currentPage: pageNum,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
    },
    events,
  });
});
