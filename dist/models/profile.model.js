"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Profile = void 0;
// src/models/profile.model.ts
const mongoose_1 = require("mongoose");
const ProfileSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    bio: { type: String, default: '' },
    age: { type: Number, default: 0 },
    address: { type: String, default: '' },
}, { timestamps: true });
exports.Profile = (0, mongoose_1.model)('Profile', ProfileSchema);
