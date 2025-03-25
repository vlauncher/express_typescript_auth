"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/profile.routes.ts
const express_1 = require("express");
const profile_controllers_1 = require("../controllers/profile.controllers");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
const profileController = new profile_controllers_1.ProfileController();
// Get the profile of the logged-in user
router.get('/', auth_1.authMiddleware, profileController.getProfile);
// Update the profile of the logged-in user
router.put('/', auth_1.authMiddleware, profileController.updateProfile);
exports.default = router;
