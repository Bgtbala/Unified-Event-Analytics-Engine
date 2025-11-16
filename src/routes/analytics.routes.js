// src/routes/analytics.routes.js
import express from "express";
import apiKeyAuth from "../middlewares/apiKeyAuth.js";
import { validate } from "../middlewares/validate.js";
import { collectEventSchema } from "../validations/analytics.validation.js";
import {
  collectRateLimiter,
  analyticsRateLimiter,
} from "../middlewares/rateLimiter.js";
import { cache } from "../middlewares/cache.js";

import * as AnalyticsController from "../controllers/analytics.controller.js";

const router = express.Router();

// ---------------------------------------------
// CACHE KEYS
// ---------------------------------------------
const eventSummaryCacheKey = (req) => {
  return `event-summary:${req.apiKey?._id ?? "none"}:${
    req.query.event || "all"
  }:${req.query.startDate || "none"}:${req.query.endDate || "none"}`;
};

const userStatsCacheKey = (req) => {
  return `user-stats:${req.apiKey?._id ?? "none"}:${req.query.userId || "none"}`;
};

// ---------------------------------------------
// COLLECT EVENT
// ---------------------------------------------
router.post(
  "/collect",
  apiKeyAuth,
  collectRateLimiter,
  validate(collectEventSchema),
  AnalyticsController.collectEvent
);

// ---------------------------------------------
// EVENT SUMMARY
// ---------------------------------------------
router.get(
  "/event-summary",
  apiKeyAuth,
  analyticsRateLimiter,
  cache(eventSummaryCacheKey, 60),
  AnalyticsController.eventSummary
);

// ---------------------------------------------
// USER STATS
// ---------------------------------------------
router.get(
  "/user-stats",
  apiKeyAuth,
  analyticsRateLimiter,
  cache(userStatsCacheKey, 60),
  AnalyticsController.userStats
);

export default router;
