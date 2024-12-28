"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = generateOTP;
exports.checkTimeOfOTP = checkTimeOfOTP;
function generateOTP() {
    const otp = Math.floor(1000 + Math.random() * 9000);
    return otp;
}
function checkTimeOfOTP(createdAt) {
    const thirtyMinutesInMilliseconds = 30 * 60 * 1000; // 30 minutes in milliseconds
    const currentTime = new Date();
    const createdAtTime = new Date(createdAt);
    const difference = currentTime.getTime() - createdAtTime.getTime();
    return difference >= thirtyMinutesInMilliseconds;
}
