"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileService = void 0;
// src/services/profile.services.ts
const profile_model_1 = require("../models/profile.model");
class ProfileService {
    // Retrieve the profile for a given user
    getProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let profile = yield profile_model_1.Profile.findOne({ user: userId });
            if (!profile) {
                // Optionally create a default profile if not found
                profile = new profile_model_1.Profile({ user: userId });
                yield profile.save();
            }
            return profile;
        });
    }
    // Update the profile for a given user
    updateProfile(userId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedProfile = yield profile_model_1.Profile.findOneAndUpdate({ user: userId }, { $set: updateData }, { new: true, runValidators: true });
            return updatedProfile;
        });
    }
}
exports.ProfileService = ProfileService;
