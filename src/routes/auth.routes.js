import express from "express";
import { validate } from "../middlewares/validate.js";
import { registerValidation } from "../validations/auth.validation.js";
import * as AuthController from "../controllers/auth.controller.js";
import passport from "../config/passport.js";

const router = express.Router();
const isTest = process.env.NODE_ENV === "test"; // 👈 DETECT TEST MODE

// Helper: require Google auth only in normal mode
const requireAuth = (req, res, next) => {
  if (isTest) return next(); // 👈 TESTS BYPASS GOOGLE LOGIN
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  return res.status(401).json({ message: "Authentication required" });
};

// 🔐 Google OAuth2
router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/api/auth/google/failure" }),
  (req, res) => {
    return res.json({
      message: "Google login successful",
      user: req.user,
    });
  }
);

router.get("/google/failure", (req, res) => {
  res.status(401).json({ message: "Google authentication failed" });
});

// Test route for current user
router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

// 🗝 API Key management — TEST MODE = PUBLIC
router.post(
  "/register",
  requireAuth,
  validate(registerValidation),
  AuthController.registerApp
);

router.post(
  "/regenerate",
  requireAuth,
  AuthController.regenerateApiKey
);

router.post(
  "/revoke",
  requireAuth,
  AuthController.revokeApiKey
);

router.get("/logout", (req, res) => {
  req.logout(() => res.json({ message: "Logged out successfully" }));
});

export default router;
