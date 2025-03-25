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
exports.ProfileController = void 0;
const profile_services_1 = require("../services/profile.services");
class ProfileController {
    constructor() {
        this.profileService = new profile_services_1.ProfileService();
        this.getProfile = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const profile = yield this.profileService.getProfile(userId);
                res.status(200).json({ message: 'Profile retrieved successfully', profile });
            }
            catch (error) {
                next(error);
            }
        });
        this.updateProfile = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const data = req.body;
                const profile = yield this.profileService.updateProfile(userId, data);
                res.status(200).json({ message: 'Profile updated successfully', profile });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.ProfileController = ProfileController;
