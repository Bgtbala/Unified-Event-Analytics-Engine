// src/app.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "./config/passport.js"; // NEW
import routes from "./routes/index.js";
import ApiError from "./utils/ApiError.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger/swaggerSpec.js";

const app = express();

// ===== Middlewares =====
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ===== Sessions (required for Passport) =====
// Make sure SESSION_SECRET is in .env
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // must be true if using HTTPS and proxy
      sameSite: "lax",
    },
  })
);

// ===== Passport Auth (Google OAuth) =====
app.use(passport.initialize());
app.use(passport.session());

// ===== API Routes =====
app.use("/api", routes);

// ===== Swagger Docs =====
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ===== Global Error Handler =====
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== "test") {
    console.error(err);
  }

  // Custom API errors
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json(err.toJSON());
  }

  // Joi / validation errors
  if (err.isJoi) {
    return res.status(400).json({
      message: err.message,
      details: err.details,
    });
  }

  // Fallback
  return res.status(500).json({ message: "Internal Server Error" });
});

export default app;
