"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nameToCorrectString = void 0;
const nameToCorrectString = (name) => {
    return name.includes('-') ? name.split('-').join(' ') : name;
};
exports.nameToCorrectString = nameToCorrectString;
