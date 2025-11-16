// src/controllers/analytics.controller.js
import Event from "../models/Event.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { collectEventSchema } from "../validations/analytics.validation.js";

// -------------------------------------------------------
// Collect analytics event
// -------------------------------------------------------
export const collectEvent = asyncHandler(async (req, res) => {
  const payload = Array.isArray(req.body) ? req.body : [req.body];

  const validated = [];

  for (const event of payload) {
    const { error, value } = collectEventSchema.validate(event);
    if (error) {
      throw new ApiError(400, error.message);
    }
    validated.push(value);
  }

  // Use create per-document so our simple mongoose mock works
  for (const ev of validated) {
    await Event.create({
      ...ev,
      app: req.apiKey?.app,
      apiKey: req.apiKey?._id,
      timestamp: ev.timestamp || new Date(),
    });
  }

  return res
    .status(201)
    .json(ApiResponse.success(null, "Events collected successfully"));
});

// -------------------------------------------------------
// Event summary (no Mongo aggregate, pure JS)
// -------------------------------------------------------
export const eventSummary = asyncHandler(async (req, res) => {
  const { event, startDate, endDate } = req.query;

  const query = {};

  if (event) {
    query.event = event;
  }

  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) {
      query.timestamp.$gte = new Date(startDate);
    }
    if (endDate) {
      query.timestamp.$lte = new Date(endDate);
    }
  }

  const events = await Event.find(query);

  if (!events.length) {
    return res
      .status(200)
      .json(ApiResponse.success({}, "Event summary fetched successfully"));
  }

  const summaryMap = new Map();

  for (const ev of events) {
    const key = ev.event;
    if (!summaryMap.has(key)) {
      summaryMap.set(key, {
        event: key,
        count: 0,
        users: new Set(),
        mobile: 0,
        desktop: 0,
      });
    }
    const s = summaryMap.get(key);
    s.count += 1;
    if (ev.userId) {
      s.users.add(ev.userId);
    }
    if (ev.device === "mobile") {
      s.mobile += 1;
    } else if (ev.device === "desktop") {
      s.desktop += 1;
    }
  }

  const resultEvent =
    event && summaryMap.has(event)
      ? summaryMap.get(event)
      : Array.from(summaryMap.values())[0];

  const result = {
    event: resultEvent.event,
    count: resultEvent.count,
    uniqueUsers: resultEvent.users.size,
    deviceData: {
      mobile: resultEvent.mobile,
      desktop: resultEvent.desktop,
    },
  };

  return res
    .status(200)
    .json(
      ApiResponse.success(result, "Event summary fetched successfully")
    );
});

// -------------------------------------------------------
// User-based stats (pure JS on top of Event.find)
// -------------------------------------------------------
export const userStats = asyncHandler(async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    throw new ApiError(400, "userId is required");
  }

  const events = await Event.find({ userId });

  if (!events.length) {
    return res
      .status(200)
      .json(ApiResponse.success({}, "User stats fetched successfully"));
  }

  const totalEvents = events.length;
  let lastEvent = null;

  const devices = new Set();
  const browsers = new Set();
  const ips = new Set();

  for (const ev of events) {
    if (!lastEvent || ev.timestamp > lastEvent) {
      lastEvent = ev.timestamp;
    }
    if (ev.device) {
      devices.add(ev.device);
    }
    if (ev.metadata && ev.metadata.browser) {
      browsers.add(ev.metadata.browser);
    }
    if (ev.ipAddress) {
      ips.add(ev.ipAddress);
    }
  }

  const result = {
    userId,
    totalEvents,
    lastEvent,
    device: Array.from(devices),
    browser: Array.from(browsers),
    ipAddress: Array.from(ips),
  };

  return res
    .status(200)
    .json(ApiResponse.success(result, "User stats fetched successfully"));
});
